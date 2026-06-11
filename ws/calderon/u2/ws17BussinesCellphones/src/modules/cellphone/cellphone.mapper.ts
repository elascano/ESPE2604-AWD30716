// cellphone.mapper.ts

import { CellphoneRules } from "./cellphone.rules";

export class CellphoneMapper {

    static toResponse(cellphone: any) {

        return {
            id: cellphone.id,
            name: cellphone.name,
            description: cellphone.description,
            price: cellphone.price,
            releaseDate: cellphone.releaseDate,
            model: cellphone.model,
            originCountry: cellphone.originCountry,
            manufacturer: cellphone.manufacturer,

            tier: CellphoneRules.calculateTier(
                cellphone.price
            ),

            recommendation:
                CellphoneRules.calculateRecommendation(
                    cellphone.releaseDate
                )
        };
    }
}