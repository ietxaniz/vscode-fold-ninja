import { updateEditorStatus } from '../action/updateEditorStatus';

export const onTextEditorActivated = async () => {
    await updateEditorStatus(false);
};
