
/** This class provides additional functionality for `String` value type. */
export class StringUtil {
    static splitByLength(str: string, length: number) {
        const result = [];
        for (let i = 0; i < str.length; i += length) {
            result.push(str.slice(i, i + length));
        }
        return result;
    }

    static rawLiteralOf(str: string): string {
        return str
            .replaceAll("\`", "\\`")
            .replaceAll("${", "\\${");
    }

    static rawStringOf(str: string): string {
        return `String.raw\`${this.rawLiteralOf(str)}\``;
    }
}