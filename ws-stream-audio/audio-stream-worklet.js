class AudioStreamWorklet extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = this.onmessage.bind(this)
        this.buf_queue = []
        this.cur_buf_index = 0
    }

    onmessage(msg) {
        const { data } = msg;
        this.buf_queue.push(new Float32Array(data));
    }

    silence() {
        return 0; //Math.random() * 2 - 1;
    }

    process(inputs, outputs) {
        const channel = outputs[0][0];
        for (let i = 0; i < channel.length; i++) {
            if (this.buf_queue.length == 0) {
                channel[i] = this.silence();
                continue;
            }
            let cur_buf = this.buf_queue[0]
            channel[i] = cur_buf[this.cur_buf_index++];
            if (this.cur_buf_index == cur_buf.length) {
                this.cur_buf_index = 0;
                this.buf_queue.shift();
            }
        }
        return true;
    }
}

registerProcessor('audio-stream-worklet', AudioStreamWorklet);
