/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import { allPass, equals, find, compose, not, __, prop, count, gte, values, filter, countBy, converge, identity } from 'ramda';
import { COLORS } from '../constants';

const isWhite = equals(COLORS['WHITE']);
const isNotWhite = compose(not, isWhite);
const isGreen = equals(COLORS['GREEN']);
const isRed = equals(COLORS['RED']);
const isBlue = equals(COLORS['BLUE']);
const isOrange = equals(COLORS['ORANGE']);

const getCircle = prop('circle');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getStar = prop('star');

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 =
    allPass(
        [
            compose(isRed, getStar),
            compose(isGreen, getSquare),
            compose(isWhite, getTriangle),
            compose(isWhite, getCircle)
        ]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = allPass([
    compose(
        gte(__, 2),
        count(isGreen),
        values,
    )
]);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = allPass([
    compose(
        converge(equals, [count(isRed), count(isBlue)]),
        values
    )
])

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass(
    [
        compose(isRed, getStar),
        compose(isOrange, getSquare),
        compose(isBlue, getCircle)
    ]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = allPass([
    compose(
        find(gte(__, 3)),
        values,
        countBy(identity),
        filter(isNotWhite),
        values
    )
])

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(
        equals(2),
        count(isGreen),
        values,
    ),
    compose(isGreen, getTriangle),
    compose(
        equals(1),
        count(isRed),
        values,
    ),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([
    compose(
        equals(4),
        count(isOrange),
        values,
    )
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    compose(not, isRed, getStar),
    compose(not, isWhite, getStar)
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
    compose(
        equals(4),
        count(isGreen),
        values,
    )
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    converge(equals, [getTriangle, getSquare]),
    compose(
        isNotWhite,
        getTriangle
    )
]);
