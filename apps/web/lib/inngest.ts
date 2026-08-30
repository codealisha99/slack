import { Inngest } from "inngest";
import { connectDB } from "./db";
import { User } from "@slacki/db";
import { addUserToPublicChannels, deleteStreamUser, upsertStreamUser } from "./stream";

export const inngest = new Inngest({ id: "slacki" });

export const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data as any;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || id,
      image: image_url,
    };
    await User.create(newUser);
    await upsertStreamUser({ id: newUser.clerkId, name: newUser.name, image: newUser.image });
    await addUserToPublicChannels(newUser.clerkId);
  }
);

export const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data as any;
    await User.deleteOne({ clerkId: id });
    await deleteStreamUser(id);
  }
);

export const functions = [syncUser, deleteUserFromDB];
