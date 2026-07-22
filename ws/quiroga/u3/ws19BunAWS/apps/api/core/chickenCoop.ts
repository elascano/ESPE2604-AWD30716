import { Create } from "@core/chickenCoop/application/create";
import { Delete } from "@core/chickenCoop/application/delete";
import { Find } from "@core/chickenCoop/application/find";
import { Search } from "@core/chickenCoop/application/search";
import { Update } from "@core/chickenCoop/application/update";
import { ChickenCoopDrizzleRepository } from "@core/chickenCoop/Infrastructure/ChickendCoopDrizzleRepository";
import { db } from "@database/conection";

export const chickenCoopManager = {
  createChickenCoop: new Create(new ChickenCoopDrizzleRepository(db)),
  updateChickenCoop: new Update(new ChickenCoopDrizzleRepository(db)),
  updateChickenCount: new Update(new ChickenCoopDrizzleRepository(db)),
  deleteChickenCoop: new Delete(new ChickenCoopDrizzleRepository(db)),
  findChickenCoop: new Find(new ChickenCoopDrizzleRepository(db)),
  searchChickenCoop: new Search(new ChickenCoopDrizzleRepository(db)),
}
