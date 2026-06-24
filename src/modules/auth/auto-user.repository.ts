import { Injectable } from "@nestjs/common";
import { DatabaseService } from '../../infrastructure/database/database.service';
import { AutoUserRow } from "./auth.types";

@Injectable()
export class AutoUserRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByUserId(userid: string): Promise<AutoUserRow | null> {
    const rows = await this.database.query<AutoUserRow>(
      "auto",
      `SELECT userid, username, email, url_img, def_plant
       FROM syuser
       WHERE userid = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [userid],
    );

    return rows[0] ?? null;
  }
}
