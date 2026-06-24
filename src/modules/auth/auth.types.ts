import { RowDataPacket } from "mysql2/promise";

export interface AutoUserRow extends RowDataPacket {
  userid: string;
  username: string | null;
  email: string | null;
  url_img: string | null;
  def_plant: string | null;
}

export interface AuthenticatedUser {
  id: string;
  userid: string;
  name: string;
  email: string;
  avatar: string | null;
  plant: string | null;
}

export interface LdapProfile {
  displayName?: unknown;
  sn?: unknown;
  mail?: unknown;
}
