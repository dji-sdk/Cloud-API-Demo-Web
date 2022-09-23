import mitt, { Emitter } from 'mitt'

type Events = {
  deviceUpgrade: any;
  deviceLogUploadProgress: any
};

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
