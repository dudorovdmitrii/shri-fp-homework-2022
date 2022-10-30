/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { compose, otherwise, tap, not, prop, curry, gt, lt, __, test, pipe, toString, allPass, equals, length, when, andThen, flip } from 'ramda';
import Api from '../tools/api';

const api = new Api();

const getValue = prop('value');
const getResult = prop('result');
const getAnotherBaseOfNumber = (number) => api.get('https://api.tech/numbers/base', { from: 10, to: 2, number });
const getAnimalById = (id) => api.get(`https://animals.tech/${id}`, {});
const getNumberInPower = curry(flip(Math.pow));
const getRemainderOfDivisionBy = curry(flip((x, y) => x % y));

const isNotUndefined = compose(not, equals(undefined));
const isNumber = test(/^([1-9]{1}\d*|\d{1})\.?\d*$/);
const isValid = compose(
    allPass([
        isNumber,
        compose(
            gt(__, 2),
            length
        ),
        compose(
            lt(__, 10),
            length
        )
    ]),
    getValue
);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const curriedLog = curry(writeLog);
    const logValue = compose(curriedLog, getValue);

    const curriedHandleSuccess = curry(handleSuccess);

    const curriedHandleError = curry(handleError);
    const handleValidationError = () => curriedHandleError('ValidationError');

    const checkIfNumberValid = compose(
        when(
            equals(false),
            tap(handleValidationError),
        ),
        isValid,
        tap(logValue)
    );

    const handleSuccessfulGetAnimalResponse = pipe(
        getResult,
        when(
            isNotUndefined,
            tap(curriedHandleSuccess)
        )
    );

    const handleSuccessfulBaseChangeResponse = compose(
        tap(curriedLog),
        getRemainderOfDivisionBy(3),
        tap(curriedLog),
        getNumberInPower(2),
        Number,
        tap(curriedLog),
        length,
        tap(curriedLog),
    );

    const handleBaseChangeResponse = pipe(
        getResult,
        when(
            isNotUndefined,
            handleSuccessfulBaseChangeResponse
        )
    );

    const runAnimalPart = pipe(
        andThen(toString),
        andThen(id => getAnimalById(id)),
        otherwise(curriedHandleError),
        andThen(handleSuccessfulGetAnimalResponse)
    );

    const runNumberBaseChangePart = pipe(
        toString,
        getAnotherBaseOfNumber,
        otherwise(curriedHandleError),
        andThen(handleBaseChangeResponse),
    );

    const runMainPart = compose(
        runAnimalPart,
        runNumberBaseChangePart,
        tap(curriedLog),
        Math.round,
        Number,
        getValue
    );

    const app = allPass([
        checkIfNumberValid,
        runMainPart,
    ]);

    app({ value, writeLog, handleSuccess, handleError });
}

export default processSequence;