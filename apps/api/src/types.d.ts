import { Room } from "@repo/db";

interface CreateRoomRequest extends Room {
  facilities: { id: number }[];
}
interface UpdateRoomRequest extends CreateRoomRequest {
  removedImages: { id: string }[];
}
