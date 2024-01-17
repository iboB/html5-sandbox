class StreamWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = this.onmessage.bind(this)
  }

  onmessage(msg) {
    const { data } = msg;
    this.buf = new Float32Array(data);
    this.bi = 0;
  }

  process(inputs, outputs) {
    const channel = outputs[0][0];
    if (!this.buf) {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = Math.random() * 2 - 1;
      }
    }
    else {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = this.buf[this.bi++]
        if (this.bi == this.buf.length) {
          this.bi = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('stream-worklet', StreamWorklet);
