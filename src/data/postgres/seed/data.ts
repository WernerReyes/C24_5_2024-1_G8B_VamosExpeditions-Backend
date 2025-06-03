import {
  type city,
  type country,
  type distrit,
  type partner,
  type role,
  role_type,
  setting_key_enum,
  settings,
  type user,
} from "@prisma/client";
import { BcryptAdapter } from "@/core/adapters";
import { HotelCategory, type IHotelModel } from "@/infrastructure/models";

export const ROLES: Omit<role, "id_role">[] = [
  {
    name: role_type.MANAGER_ROLE,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    name: role_type.EMPLOYEE_ROLE,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
];

export const USERS: Omit<user, "id_user" | "id_role">[] = [
  {
    email: "test1@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 1",
    
    description: "description 1",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    email: "test2@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 2",

    description: "description 2",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    email: "test3@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 3",

    description: "description 3",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    email: "test4@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 4",
   
    description: "description 4",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    email: "test5@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 5",
  
    description: "description 5",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
  {
    email: "test6@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 6",
   
    description: "description 6",
    phone_number: "+51123456789",
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    deleted_at: null,
    delete_reason: null,
  },
];




export const PARNERTS: Omit<partner, "id">[] = [
  {
    name: "Travel Local",
    created_at: new Date(),
  },
];

export const DEFAULT_SETTINGS: Omit<settings, "id">[] = [
  {
    key: setting_key_enum.DATA_CLEANUP_PERIOD,
    value: "30",
    updated_at: null,
    updated_by_id: null,
    user_id: null,
  },
];
