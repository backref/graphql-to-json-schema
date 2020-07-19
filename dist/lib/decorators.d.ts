export declare type DescriptionMeta = {
    description?: string;
    __decorators?: any;
};
declare type Maybe<P> = P | null | undefined;
export declare function parseDescriptionDecorators(description: Maybe<string>): DescriptionMeta;
export {};
