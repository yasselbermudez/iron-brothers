import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { profileFormSchema, type ProfileFormValues} from "./ProfileSchema";
import type { GymProfileInit, GymProfileForm} from "../../services/api.interfaces";

interface ProfileFormProps {
  initialData?: GymProfileForm;
  onSubmit: (data: GymProfileInit) => void;
}

export function ProfileForm({ initialData, onSubmit}: ProfileFormProps) {
  
  const [descripcionLength, setDescripcionLength] = useState(
    initialData?.description?.length || 0
  );

  const [startingProfile,setStartingProfile] = useState(false)

  const isInit:boolean = initialData?false:true

  const form = useForm<ProfileFormValues>({
    
    resolver: zodResolver(profileFormSchema),
    
    defaultValues: initialData || {
        edad: 18,
        peso_corporal: 60,
        estatura: 170,
        frase: "",
        apodo: "",
        mujeres: "",
        objetivo: "",
        pressBanca: 20,
        sentadilla: 50,
        pesoMuerto: 50,
        prensa: 100,
        biceps: 20,
        description: "",
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    const profileData:GymProfileInit = {
        ...data,
        edad:data.edad.toString(),
        estatura:data.estatura.toString(),
        peso_corporal:data.peso_corporal.toString(),
        pesos:{
            pesoMuerto:data.pesoMuerto.toString(),
            sentadilla:data.sentadilla.toString(),
            pressBanca:data.pressBanca.toString(),
            prensa:data.prensa.toString(),
            biceps:data.biceps.toString()
        },
    }
    setStartingProfile(true)
    onSubmit(profileData)
  };

  const exercises = [
    { id: "pressBanca", label: "Press Banca", placeholder: "Ej: 100" },
    { id: "sentadilla", label: "Sentadilla", placeholder: "Ej: 120" },
    { id: "pesoMuerto", label: "Peso Muerto", placeholder: "Ej: 150" },
    { id: "prensa", label: "Prensa", placeholder: "Ej: 200" },
    { id: "biceps", label: "Bíceps", placeholder: "Ej: 40" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Sección 1: Información Personal */}
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-4">
            Información Personal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Edad */}
           {isInit &&
              <FormField
                control={form.control}
                name="edad"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-300">Edad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Tu edad"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
           
           }
            

            {/* Peso Corporal */}
            <FormField
              control={form.control}
              name="peso_corporal"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-300">
                    Peso Corporal (kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 75"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Estatura */}
            {isInit && 
                <FormField
                    control={form.control}
                    name="estatura"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                        <FormLabel className="text-slate-300">Estatura (cm)</FormLabel>
                        <FormControl>
                            <Input
                            type="number"
                            placeholder="Tu estatura"
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                                const value = e.target.valueAsNumber;
                                field.onChange(isNaN(value) ? 0 : value);
                            }}
                            />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />
            }
            
            {/* Frase */}
            <FormField
              control={form.control}
              name="frase"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-300">
                    Frase personal
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Una frase o lema personal que te identifique"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Apodo */}
            <FormField
              control={form.control}
              name="apodo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-300">Apodo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu apodo en el gym"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mujeres"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-300">Mujeres</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Conquistas amorosas"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Objetivo */}
            <FormField
              control={form.control}
              name="objetivo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-300">Objetivo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Algún objetivo o proyecto que tengas en mente"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Sección 2: Pesos */}
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-4">
            Récords de Pesos (kg)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <FormField
                key={exercise.id}
                control={form.control}
                name={exercise.id as keyof ProfileFormValues}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-300">
                      {exercise.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={exercise.placeholder}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Sección 3: Descripción */}
        {isInit && 
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold text-white mb-4">
              Resumen / Descripción Personal
            </h2>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Cuéntanos sobre ti, tu experiencia, motivación, etc.
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe aquí tu descripción personal..."
                      rows={5}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setDescripcionLength(e.target.value.length);
                      }}
                    />
                  </FormControl>
                    <div className="flex justify-between items-center">
                    <FormMessage className="text-red-400" />
                      <p className="text-xs text-slate-500 mt-2">
                        {descripcionLength}/500 caracteres
                      </p>
                    </div>
                </FormItem>
              )}
            />
          </div>
        }
        
        {/* Botón de activación */}
        <Button
          type="submit"
          variant="outline"
          disabled={startingProfile}
          className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-700 hover:from-slate-700 hover:to-slate-800 hover:text-white hover:border-slate-600 transition-all duration-300 py-6"
        > 
          {startingProfile
            ?<><Loader2 className='animate-spin'/>Procesando</>
            :<><Settings2/>{isInit?"Activar Perfil":"Enviar"}</>
          }
        </Button>
      </form>
    </Form>
  );
}