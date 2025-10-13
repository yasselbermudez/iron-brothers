export interface Deuda {
    tipo: string;
    cantidad: string;
}

export interface Pesos {
    pressBanca: string;
    sentadilla: string;
    pesoMuerto: string;
    prensa: string;
    biceps: string;
}

export interface Persona {
    id: number;
    name: string;
    apodo: string;
    titulo: string;
    pesoCorporal: string;
    altura: string;
    aura: string;
    deuda: Deuda;
    pesos: Pesos;
    mujeres: string;
    reto: string;
    frase: string;
    objetivo: string;
    evento: string;
    img: string;
}