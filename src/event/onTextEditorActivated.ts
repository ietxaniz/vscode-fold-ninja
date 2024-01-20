import { updateEditorStatus } from "../internal/updateEditorStatus";

export const onTextEditorActivated = async () => {
  await updateEditorStatus(false);
}
