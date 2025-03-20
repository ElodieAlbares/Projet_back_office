// historique.model.ts
export interface Historique {
    id: number;
    type: string;
    fieldName: string;
    value: any;
    oldValue: any;
    timeStamp: string;
}