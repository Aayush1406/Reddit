import { Buffer } from "buffer";
import stream from "stream";

window.Buffer = Buffer;
window.stream = stream;
window.Transform = stream.Transform;
