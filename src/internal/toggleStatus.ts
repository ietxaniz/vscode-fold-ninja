import { readConfig, writeConfig, Status } from "../configuration/config";
import { updateEditorStatus } from "./updateEditorStatus";

export const toggleStatus = async () => {
  const config = readConfig();

  let newStatus: Status;
  const currentStatus = config.status;
  switch (currentStatus) {
    case Status.Inactive:
      newStatus = Status.Expanded;
      break;
    case Status.Expanded:
      newStatus = Status.Compact;
      break;
    case Status.Compact:
      newStatus = Status.Inactive;
      break;
    default:
      newStatus = Status.Inactive;
      break;
  }
  const newConfig = { ...config, status: newStatus };
  await writeConfig(newConfig);
  await updateEditorStatus(newConfig);
  return newStatus;
};
