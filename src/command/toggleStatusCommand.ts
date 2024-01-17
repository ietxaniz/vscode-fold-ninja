import { toggleStatus } from "../internal/toggleStatus";
import { updateStatusBarItem } from "../internal/updateStatusBarItem";

export const toggleStatusCommand = async () => {
  await toggleStatus(false);
  updateStatusBarItem();
};
