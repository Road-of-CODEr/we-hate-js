// 제곱 계산을 합니다.
const pow = (num1, num2) => {
    return Math.pow(num1, num2);
}

// 숫자를 음수로 만듭니다.
const negate = (num) => {
    return num * -1;
}

// 숫자에 더하기 1을 합니다.
const inc = (num) => {
    return num + 1;
}

const powered = pow(2, 4);
const negated = negate(powered);
const result = inc(negated);

console.log(result); // -15

inc(negate(pow(2, 4))); // -15

const compose = (...fns) => {  // ..., fn3, fn2, fn1
    return (...args) => {
        return fns.reduceRight(
            (res, fn) => [fn.call(null, ...res)], // 입력 받은 fns 를 오른쪽부터 실행
            args // 초기값으로 받은 파라미터
        )[0];
    }
};


const mySpecialFunc = compose(
    (num) => inc(num),
    (num) => negate(num),
    (num1, num2) => pow(num1, num2)
);

mySpecialFunc(2, 4);

const mySpecialFunc2 = compose(inc, negate, pow);
mySpecialFunc2(2, 4);

const pipe = (...fns) => {
    return (...args) => {
        return fns.reverse().reduceRight( // 입력 받은 fns의 순서를 뒤집는다
            (res, fn) => [fn.call(null, ...res)], // 순서가 뒤집어진 fns 를 오른쪽부터 실행
            args // 초기값으로 받은 파라미터
        )[0];
    }
};

const mySpecialFunc3 = pipe(pow, negate, inc)

mySpecialFunc3(2, 4); // -15


//


const person = {
    name: 'nakata',
    age: 10,
    work: 'developer'
}

const dissoc1 = (dissocKey, obj) => {
    return Object.keys(obj).reduce(
        (acc, key) => {
            if (key === dissocKey) return acc;
            acc[key] = obj[key];
            return acc;
        },
        {}
    )
}


const rename1 = (keysMap, obj) => {
    return Object.keys(obj).reduce(
        (acc, key) => {
            acc[keysMap[key] || key] = obj[key];
            return acc;
        },
        {}
    );
};

pipe(
    person => dissoc1('age', person),
    person => rename1({work: 'job'}, person)
)(person); // { name: 'nakta', job: 'developer' }


const dissocC1 = (dissocKey) => (obj) => {
    return Object.keys(obj).reduce(
        (acc, key) => {
            if (key === dissocKey) return acc;
            acc[key] = obj[key];
            return acc;
        },
        {}
    )
};

const renameC1 = (keysMap) => (obj) => {
    return Object.keys(obj).reduce(
        (acc, key) => {
            acc[keysMap[key] || key] = obj[key];
            return acc;
        },
        {}
    );
};


const dissocAge = dissocC1('age'); // (obj) => { obj 에서 'age' 키를 지워서 반환해 }
dissocAge(person); // { name: 'nakta', work: 'developer' }



pipe(
    dissocC1('age'),
    renameC1({ work: 'job' })
)(person); // { name: 'nakta', job: 'developer' }


const curry = (fn) => {
    const arity = fn.length;

    return function _curry(...args) {
        if (args.length < arity) {
            return _curry.bind(null, ...args);
        }

        return fn.call(null, ...args);
    };
}


const dissoc = curry((dissocKey, obj) => {
    return Object.keys(obj).reduce(
        (acc, key) => {
            if (key === dissocKey) return acc;
            acc[key] = obj[key];
            return acc;
        },
        {}
    )
});


const rename = curry((keysMap, obj) => {
    return Object.keys(obj).reduce(
        (acc, key) => {
            acc[keysMap[key] || key] = obj[key];
            return acc;
        },
        {}
    );
});



// 상자 안에 값 넣
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

const box1 = new Box('fp1') // Box('fp1')
const box2 = Box.of('fp2') // Box('fp2')
const box3 = Box.of(Box.of('fp3')) // Box(Box('fp3'))

pipe(
    dissoc('age'),
    rename({ work: 'job' })
)(person); // { name: 'nakta', job: 'developer' }

pipe(
    dissoc('age'),
    rename({ work: 'job' }),
    (value) => new Box(value)
)(person); // Box({ name: 'nakta', job: 'developer' })

pipe(
    dissoc('age'),
    rename({ work: 'job' }),
    Box.of
)(person); // Box({ name: 'nakta', job: 'developer' })


// books
const books = [
    { id: 'book1', title: 'coding with javascript' },
    { id: 'book2', title: 'speaking javaScript' },
];


// 첫 글자를 대문자로 바꿔줍니다.
const startCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// 객체에서 propName에 해당하는 값을 반환합니다.
const prop = (propName, obj) => {
    return obj[propName];
};

const findBookById = (id, books) => {
    return books.find((book) => book.id === id);
};

const getUpperBookTitleById1 = (id, books) => {
    return pipe(
        Box.of, // Box(books)
        (box) => findBookById(id, box.$value),
        prop('title'),
        startCase
    )(books)
};


// getUpperBookTitleById1('book1', books); // Box("Coding with javascript")
// getUpperBookTitleById1('book2', books); // Box("Speaking javaScript")

// 상자 안에 값을 바꾸려면?

const addFive = (num) => {
    return num + 5;
}

Box.of(1).map(addFive); // Box(6)
Box.of(1).map(addFive).map(addFive); // Box(11)
Box.of('hello, FP').map(startCase); // Box('Hello, FP')

// 함수자에 map 메소드를 실행할 helper 함수
const map = curry((fn, functor) => {
    return functor.map(fn);
});

const propC = curry((propName, obj) => {
    return obj[propName];
});
const findBookByIdC = curry((id, books) => {
    return books.find((book) => book.id === id);
});



const getUpperBookTitleById2 = (id, books) => {
    return pipe(
        Box.of, // Box(books)
        map(findBookByIdC(id)), // Box(book)
        map(propC('title')), // Box('book title');
        map(startCase) // Box('Book title');
    )(books)
};

getUpperBookTitleById2('book1', books); // Box("Coding with javascript")
getUpperBookTitleById2('book2', books); // Box("Speaking javaScript")

// getUpperBookTitleById2('book3', books); // Cannot read property 'title' of undefined



// maybe

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

const getUpperBookTitleById3 = (id, books) => {
    return pipe(
        Maybe.of, // Just(books)
        map(findBookByIdC(id)), // undefined -> Nothing
        map(propC('title')),
        map(startCase)
    )(books)
};

getUpperBookTitleById3('book1', books); // Just("Coding with javascript")
getUpperBookTitleById3('book2', books); // Just("Speaking javaScript")
getUpperBookTitleById3('book3', books); // Nothing

const getOrElse = curry((defaultValue, fn, maybe) => {
    return maybe.isNothing ? defaultValue : fn(maybe.$value);
});

const getUpperBookTitleById4 = (id, books) => {
    return pipe(
        Maybe.of,
        map(findBookByIdC(id)),
        map(propC('title')),
        getOrElse(`${id} Not Found`, startCase)
    )(books)
};

getUpperBookTitleById4('book1', books); // "Coding with javascript"
getUpperBookTitleById4('book2', books); // "Speaking javaScript"
getUpperBookTitleById4('book3', books); // "book3 Not Found"


const getOrElse2 = curry((defaultValue, maybe) => {
    return maybe.isNothing ? defaultValue : maybe.$value;
});

const getUpperBookTitleById5 = (id, books) => {
    return pipe(
        Maybe.of,
        map(findBookByIdC(id)),
        map(propC('title')),
        map(startCase),
        getOrElse2(`${id} Not Found`)
    )(books)
};


getUpperBookTitleById5('book1', books); // "Coding with javascript"
getUpperBookTitleById5('book2', books); // "Speaking javaScript"
getUpperBookTitleById5('book3', books); // "book3 Not Found"


//
const booksWithAuthor = [
    { id: 'book1', title: 'coding with javascript', author: 'Chris Minnick, Eva Holland' },
    { id: 'book2', title: 'speaking javaScript', author: 'Axel Rauschmayer' },
];



const validateBookAuthor = (book) => {
    return book.author.indexOf('Axel') > -1 ? Maybe.of(book) : Maybe.of(null);
}

const logByMaybeStatus = (maybeAxelBook) => {
    if (maybeAxelBook.isNothing) {
        // console.error로 책 저자 로그
    } else {
        // console.log로 책 저자 로그
        console.log(maybeAxelBook.$value.author);
    }
}

const logBookAuthor = (bookId, books) => {
    return pipe(
        findBookByIdC(bookId),
        validateBookAuthor,
        logByMaybeStatus
    )(books)
};

logBookAuthor('book1', booksWithAuthor); // Nothing
logBookAuthor('book2', booksWithAuthor); // Just({ id: 'book2', title: 'speaking javaScript', author: 'Axel Rauschmayer' })

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

const concat = curry((str1, str2) => {
    return `${str1}${str2}`
})

Either.right('Star').map(concat('Super')); // Right('SuperStart')
Either.left('Star').map(concat('Super')); // Left('Star')

Either.right({name: 'Nakta', job: 'Developer'}).map(propC('name')); // 'Nakta'
Either.left({name: 'Nakta', job: 'Developer'}).map(propC('name')); // {name: 'Nakta', job: 'Developer'}



const validateBookAuthor2 = (book) => {
    return book.author.indexOf('Axel') === -1
        ? Either.left(book)
        : Either.right(book);
}

const logByEitherStatus2 = (eitherBook) => {
    return eitherBook.isLeft
        ? console.error(`Author: ${eitherBook.$value.author}`)
        : console.log(`Author: ${eitherBook.$value.author}`)
}

const logBookAuthor2 = (bookId, books) => {
    return pipe(
        findBookByIdC(bookId),
        validateBookAuthor2,
        logByEitherStatus2
    )(books)
};
logBookAuthor2('book1', booksWithAuthor);
logBookAuthor2('book2', booksWithAuthor);1