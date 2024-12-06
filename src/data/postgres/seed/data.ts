import { BcryptAdapter } from "@/core/adapters";
import { role, user, role_type } from "@prisma/client";


export const ROLES: role[] = [
  {
    id_role: 1,
    name: role_type.MANAGER_ROLE
  },
  {
    id_role: 2,
    name: role_type.EMPLOYEE_ROLE
  },
];

export const USERS: user[] = [
  {
    id_user: 1,
    email: "test1@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 1",
    id_role: 1,
  },
  {
    id_user: 2,
    email: "test2@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 2",
    id_role: 2,
  },
  {
    id_user: 3,
    email: "test3@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 3",
    id_role: 1,
  },
  {
    id_user: 4,
    email: "test4@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 4",
    id_role: 2,
  },
  {
    id_user: 5,
    email: "test5@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 5",
    id_role: 1,
  },
  {
    id_user: 6,
    email: "test6@google.com",
    password: BcryptAdapter.hash("aLTEC1234@"),
    fullname: "Test 6",
    id_role: 2,
  },
];
