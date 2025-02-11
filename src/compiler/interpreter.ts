import { FunctionList } from './functions'

export interface InterpreterResult {
    code: string;
    functions: IntPushType[];
}
type IntPushType = [string, any];

/**
 * Finds the closest function in string
 * @param name
 * @returns
 */
function closestMatch(name: string, ff: string[]) {
    return ff
        .filter(f => name.slice(0, f.length).toLowerCase() === f.toLowerCase())
        .sort((vodka, chacha) => chacha.length - vodka.length)[0] || null;
}

/**
 * Predicates of incoming function
 * @param name
 * @returns
 */
function predicateFunction(name: string, ff: string[]) {
    return ff
        .filter(f => f.toLowerCase()
        .includes(name.toLowerCase()))
        .sort((vodka, chacha) => vodka.length - chacha.length)[0]
        || null;
}

/**
 * Gets a function in matched string
 * @param name
 * @returns
 */
function getFunction(name: string, ff: string[]) {
    return ff
        .filter(f => f.toLowerCase()
        .includes(name.toLowerCase()))
        .find((vodka) => vodka.length === name.length)
        || null;
}

function FFToString() {
    return Object.keys(FunctionList);
}

/**
 * Interprets code into AST
 * @param code
 * @returns
 */
function Interpreter(code: string, reverse = false): InterpreterResult {
    const copyCode = code.slice(0);
    let current = 0;
    let char = copyCode[current];
    const collectedFunctions = [['', '']];
    let newCode = "";
    collectedFunctions.shift();
    function getUnpack(dontCompile = false) {
        if (char !== "[")
            return null;
        let stop = false;
        let end = 0;
        let data = "[";
        unpacking: while (current < copyCode.length && !stop) {
            char = copyCode[current];
            current++;
            if (char === "[") {
                end += 1;
            }
            if (char === "]")
                end -= 1;
            data += char;
            if (end < 0) {
                stop = true;
                break unpacking;
            }
        }
        return dontCompile ? data : Interpreter(data);
    }
    parsing: while (current < copyCode.length) {
        char = copyCode[current];
        if (char === "$") {
            let initialValue = '$';
            current++;
            char = copyCode[current];
            getFunc: while (current < copyCode.length) {
                if (/[\[\]$ ]/.test(char))
                    break getFunc;
                initialValue += char;
                current++;
                if (copyCode[current])
                    char = copyCode[current];
                else
                    char = "";
                if (!predicateFunction(initialValue, FFToString().concat(CompilerPlugin.manager.array().map(f => f.identifier)))) {
                    break getFunc;
                }
            }
            if (char !== "$")
                initialValue += char;
            if (char !== "$")
                current++;
            const F = getFunction(closestMatch(initialValue, FFToString().concat(CompilerPlugin.manager.array().map(f => f.identifier))) || "", FFToString().concat(CompilerPlugin.manager.array().map(f => f.identifier)));
            const body = [F, getUnpack()];
            if (F)
                collectedFunctions.push(body as string[]);
            newCode += initialValue;
            continue parsing;
        }
        else {
            newCode += char;
            current++;
            continue parsing;
        }
    }
    
    return {
        code: newCode,
        // @ts-ignore
        functions: reverse ? collectedFunctions.reverse() : collectedFunctions
    }
};

export default Interpreter;