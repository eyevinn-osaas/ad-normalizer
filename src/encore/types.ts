// Minimal implementation of an encore job
export type EncoreJob = {
    externalId: string;
    profile: string;
    outputFolder: string;
    basename: string;
    progressCallbackUri: string;
    inputs: InputFile[];
}

export type InputFile = {
    uri: string;
    seekTo: number;
    copyTs: boolean;
    type: InputType
}

enum InputType {
    AUDIO ="Audio",
    VIDEO="Video",
    AUDIO_VIDEO="AudioVideo"
}

