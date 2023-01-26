
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface User {
    id: string;
    username?: Nullable<string>;
}

export interface IQuery {
    findUsers(username?: Nullable<string>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
}

export interface IMutation {
    createUser(username?: Nullable<string>): Nullable<CreateUsernameResponse> | Promise<Nullable<CreateUsernameResponse>>;
}

export interface CreateUsernameResponse {
    success?: Nullable<boolean>;
    error?: Nullable<string>;
}

type Nullable<T> = T | null;
