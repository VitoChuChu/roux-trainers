export default class Selector {
    names: string[];
    displayNames?: string[];
    flags: number[];
    kind: string;
    label?: string;
    annotation?: string;

    constructor(config: {names: string[], flags: number[], kind: string, label?: string, annotation? : string, displayNames?: string[]}) {
        const { names, flags, kind, label, annotation, displayNames } = config
        this.names = names
        this.displayNames = displayNames
        this.flags = flags
        this.kind = kind
        this.label = label
        this.annotation = annotation
    }

    getDisplayName(i: number): string {
        if (this.displayNames && i < this.displayNames.length) {
            return this.displayNames[i]
        }
        return this.names[i]
    }

    getActiveNames() {
        let ans = []
        for (let i = 0; i < this.flags.length; i++) {
            if (this.flags[i] === 1) {
                ans.push(this.names[i])
            }
        }
        return ans
    }

    getActiveName() {
        for (let i = 0; i < this.flags.length; i++) {
            if (this.flags[i] === 1) {
                return (this.names[i])
            }
        }
        return ""
    }

    setFlags(newFlags: number[]) {
        const { names, kind, label, displayNames } = this
        return new Selector({names, flags: newFlags, kind, label, displayNames})
    }
}