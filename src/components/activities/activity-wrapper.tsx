'use client'

import { useMemo, useState } from "react";
import { IActivityOperation, IDesvioCargas, IInspeccionMantos, IInspeccionPilas, ISondeos } from "@/app/models/activity.type";
import DesvioCargas from "./table-desvio-de-carga";
import InspeccionMantosTable from "./table-mantos";
import InspeccionPilasTable from "./table-pilas";
import SondeosTable from "./table-sondeos";

type IActivityOperationArray = IActivityOperation[]; 

export const ActivityWrapper = ({ data }: { data: IActivityOperationArray }) => {

    const [badgeSelect, setBadgeSelect] = useState('');

    const [groupActivities, badges] = useMemo(() => {
         const groupActivities =  Object.groupBy(data, (activity) => activity.type);

         const badges =  Object.keys(groupActivities).toSorted()
         setBadgeSelect(badges[0] || '');
         
         return [ groupActivities, badges]
    }, [data]);

  return <div className="min-h-screen px-4 py-8"> <div>
          {
            badges.map((type, index) => (
              <span
                key={index}
                className={`cursor-pointer inline-block px-3 py-1 mr-2 mb-2 rounded-full text-sm font-medium capitalize ${
                  badgeSelect === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setBadgeSelect(type)}
              >
                {type.replaceAll("_", " ")}
              </span>
            ))
          }

          { badgeSelect && (
            <div className="mt-6">
              { badgeSelect === 'desvio_de_cargas' &&
                <DesvioCargas data={groupActivities[badgeSelect] as unknown as IDesvioCargas[] } />
              }
              { badgeSelect === 'inspeccion_mantos_carbon' &&
                <InspeccionMantosTable data={groupActivities[badgeSelect] as unknown as IInspeccionMantos[]} />
              }
              { badgeSelect === 'inspeccion_pilas' &&
                <InspeccionPilasTable data={groupActivities[badgeSelect] as unknown as IInspeccionPilas[]} />
              }
              { badgeSelect === 'sondeo_cargas' &&
                <SondeosTable data={groupActivities[badgeSelect] as unknown as ISondeos[]} />
              }
            </div>
              )}
        </div>
</div>;
}