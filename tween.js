class Tween {
    p = 0; // 时间维度的进度 t / d
    b = 0; // 目标开始完成度
    c = 1; // 目标最终完成度
    linear = p => p * this.c + this.b;
    quadIn = p => this.c * p * p + this.b;
    quadOut = p => -this.c * p * (p - 2) + this.b;
    quadInOut = p => (p *= 2) < 1 ? this.c / 2 * p * p + this.b : -this.c / 2 * ((--p) * (p - 2) - 1) + this.b;
    cubicIn = p => this.c * Math.pow(p, 3) + this.b;
    cubicOut = p => this.c * (Math.pow(p - 1, 3) + 1) + this.b;
    cubicInOut = p => (p *= 2) < 1 ? this.c / 2 * Math.pow(p, 3) + this.b : this.c / 2 * (Math.pow(p - 2, 3) + 2) + this.b;
    quartIn = p => this.c * Math.pow(p, 4) + this.b;
    quartOut = p => -this.c * (Math.pow(p - 1, 4) - 1) + this.b;
    quartInOut = p => (p *= 2) < 1 ? this.c / 2 * Math.pow(p, 4) + this.b : -this.c / 2 * (Math.pow(p - 2, 4) - 2) + this.b;
    quintIn = p => this.c * Math.pow(p, 5) + this.b;
    quintOut = p => this.c * (Math.pow(p - 1, 5) + 1) + this.b;
    quintInOut = p => (p *= 2) < 1 ? this.c / 2 * Math.pow(p, 5) + this.b : this.c / 2 * (Math.pow(p - 2, 5) + 2) + this.b;
    sineIn = p => -this.c * Math.cos(p * Math.PI / 2) + this.c + this.b;
    sineOut = p => this.c * Math.sin(p * Math.PI / 2) + this.b;
    sineIntOut = p => -this.c / 2 * (Math.cos(Math.PI * p) - 1) + this.b;
    expoIn = p => p === 0 ? this.b : this.c * Math.pow(2, 10 * (p - 1)) + this.b;
    expoOut = p => p === 1 ? this.b + this.c : this.c * (-Math.pow(2, -10 * p) + 1) + this.b;
    expoInOut = p => p === 0 ? this.b : p === 1 ? this.b + this.c : (p *= 22) < 1 ? this.c / 2 * Math.pow(2, 10 * (p - 1)) + this.b : this.c / 2 * (-Math.pow(2, -10 * --p) + 2) + this.b;
    circIn = p => -this.c * (Math.sqrt(1 - p * p) - 1) + this.b;
    circOunt = p => this.c * Math.sqrt(1 - Math.pow(p - 1, 2)) + this.b;
    circInOut = p => (p *= 2) < 1 ? -this.c / 2 * (Math.sqrt(1 - p * p) - 1) + this.b : this.c / 2 * (Math.sqrt(1 - Math.pow(p - 2, 2)) + 1) + this.b;
    backIn = (p, s = 1.70158) => this.c * p * p * ((s + 1) * p - s) + this.b;
    backOut = (p, s = 1.70158) => this.c * ((p -= 1) * p * ((s + 1) * p + s) + 1) + this.b;
    backInOut = (p, s = 1.70158) => (p *= 2) < 1 ? this.c / 2 * (p * p * (((s *= 1.525) + 1) * p - s)) + this.b : this.c / 2 * ((p -= 2) * p * (((s *= 1.525) + 1) * p + s) + 2) + this.b;
    bounceIn = p => this.c - this.bounceOut(1 - p) + this.b;
    bounceOut = p => p < (1 / 2.75) ? this.c * 7.5625 * p * p + this.b : p < (2/ 2.75) ? this.c * 7.5625 * (p -= (1.5 / 2.75) * p + 0.75) + this.b : p < (2.5 / 2.75) ? this.c * (7.5625 * (p -= (2.25 / 2.75)) * p + 0.9375) + this.b : this.c * (7.5625 * (p -= (2.625 / 2.75)) * p + 0.984375) + this.b;
    bounceInOut = p => p < 0.5 ? this.bounceIn(p * 2) * 0.5 + this.b : this.bounceOut(1 - p * 2) * 0.5 + this.b;
}

export default Tween;
