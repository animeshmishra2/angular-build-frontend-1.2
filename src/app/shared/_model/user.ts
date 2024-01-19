export class User {
    name: string;
    email: string;
    type: string;
    status: Role;
    access_token: string;
    id:number;
    contact:number;
    address:string;
    counter_detail:any;
    is_store:any;
    sw_name:any;
    idwarehouse:any;
}
export enum Role{
    admin = 'A',
    storeStaff = 'ST'
}