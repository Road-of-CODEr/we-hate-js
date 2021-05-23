const compose = (...fns) => {  // ..., fn3, fn2, fn1
    return (...args) => {
        return fns.reduceRight(
            (res, fn) => [fn.call(null, ...res)], // 입력 받은 fns 를 오른쪽부터 실행
            args // 초기값으로 받은 파라미터
        )[0];
    }
};



const pipe = (...fns) => {
    return (...args) => {
        return fns.reverse().reduceRight( // 입력 받은 fns의 순서를 뒤집는다
            (res, fn) => [fn.call(null, ...res)], // 순서가 뒤집어진 fns 를 오른쪽부터 실행
            args // 초기값으로 받은 파라미터
        )[0];
    }
};

const curry = (fn) => {
    const arity = fn.length;

    return function _curry(...args) {
        if (args.length < arity) {
            return _curry.bind(null, ...args);
        }

        return fn.call(null, ...args);
    };
}

class Box {
    constructor(value) {
        this.$value = value;
    }
    static of (value) {
        return new Box(value);
    }
    map(fn) {
        return new Box(fn(this.$value));
    }

}



const map = curry((fn, functor) => {
    return functor.map(fn);
});


class Maybe {
    constructor(value) {
        this.$value = value;
    }

    static of(value) {
        return new Maybe(value);
    }

    get isNothing() {
        return this.$value === null || this.$value === undefined;
    }

    map(fn) {
        return this.isNothing ? this : Maybe.of(fn(this.$value));
    }

    toString() {
        return this.isNothing ? 'Nothing' : `Just(${this.$value})`
    }
}


class Either {
    constructor(value){
        this.$value = value;
    }

    static right(value) {
        return new Right(value)
    }

    static left(value) {
        return new Left(value);
    }
}

class Right extends Either {
    get isRight() {
        return true;
    }

    get isLeft() {
        return false
    }

    map(fn) {
        return new Right(fn(this.$value));
    }
}

class Left extends Either {
    get isRight() {
        return false;
    }

    get isLeft() {
        return true;
    }

    map(fn) {
        return this;
    }
}