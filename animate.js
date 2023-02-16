class Animate {

    _frame = 60; // 真实执行帧率
    frame = 60; // 效果帧率

    duration = 0;

    _count = 0; // 已执行真实帧数
    count = 0; // 抽象出来的已执行的效果帧数

    _stop = true;
    execution = () => void 0;

    constructor(execution, duration, frame) {
        this.execution = execution;
        this.duration = duration || 0;
        this.frame = Math.max(Math.min(frame || 60, 60), 0);
    }

    getFrames(duration, frame) {
        return duration * frame;
    }

    renderFrame() {
        const _current = this.getFrames(this.duration, this._frame);
        if (this._count < _current && !this._stop) {
            this._count++;
            if (this._count / _current >= this.count / this.getFrames(this.duration, this.frame)) {
                // 效果帧率
                this.count++;
                this.execution(this.count / this.getFrames(this.duration, this.frame));
            }
            requestAnimationFrame(this.renderFrame.bind(this));
        } else if (this._count >= _current) {
            this._stop = true;
        }
    }

    run() {
        this._stop = false;
        requestAnimationFrame(this.renderFrame.bind(this));
    }

    stop() {
        this._stop = true;
    }

    reset() {
        this._count = this.count = 0;
        this._stop = true;
    }
}

export default Animate;
