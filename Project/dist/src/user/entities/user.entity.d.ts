import { Package } from 'src/package/entities/package.entity';
export declare class User {
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    mobileNo: string;
    password: string;
    company: string;
    gender: string;
    profilePicture: string;
    userType: string;
    packageId: number;
    package: Package;
}