import { z } from "zod";

export const profileFormSchema = z.object({
    
    edad: z.number().min(7, "Debe ser superior a 7").max(100, "Edad demasiado alta"),
    peso_corporal: z.number().min(40, "Debe ser superior a 40").max(250, "Peso demasiado alto"),
    estatura: z.number().min(100, "Debe ser superior a 100").max(250, "Estatura demasiado alta"),
  
    frase: z.string().min(5, "Minimo 5 caracteres").max(100, "Maximo 100 caracteres").optional(),
    apodo: z.string().min(3, "Minimo 3 caracteres").max(50, "Maximo 50 caracteres").optional(),
    objetivo: z.string().min(5, "Minimo 5 caracteres").max(200, "Maximo 200 caracteres").optional(),
  
    pressBanca: z.number().min(10, "Debe ser superior a 10").max(300, "Valor demasiado alto"),
    sentadilla: z.number().min(40, "Debe ser superior a 40").max(400, "Valor demasiado alto"),
    pesoMuerto: z.number().min(30, "Debe ser superior a 30").max(400, "Valor demasiado alto"),
    prensa: z.number().min(100, "Debe ser superior a 100").max(800, "Valor demasiado alto"),
    biceps: z.number().min(5, "Debe ser superior a 5").max(200, "Valor demasiado alto"),
  

    descripcion: z.string().max(500, "Excede los 500 caracteres").optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;