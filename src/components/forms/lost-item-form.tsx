'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import React, { useCallback, useEffect, useState } from "react"
import { Map, Marker, MarkerDragEvent } from '@vis.gl/react-maplibre'
import {createClient} from "@/utils/supabase/client";

interface LostItemFormProps {
    onSuccess?: () => void
    selectedLocation?: { lat: number; lng: number } | null
}

const LostItemForm: React.FC<LostItemFormProps> = ({ onSuccess, selectedLocation: initialLocation }) => {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(initialLocation ?? null)

    // フォームのスキーマ
    const formSchema = z.object({
        title: z.string().min(1, "タイトルを入力してください"),
        description: z.string().min(1, "説明を入力してください"),
        location: z.string().min(1, "場所を設定してください"),
    });

    // フォームの初期値
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
        },
    });

    // selectedLocationが変わったらlocationフィールドに反映
    useEffect(() => {
        if (initialLocation) {
            setCurrentLocation(initialLocation)
            form.setValue('location', `${initialLocation.lat}, ${initialLocation.lng}`)
        }
    }, [initialLocation, form])

    // マーカーをドラッグした時の処理
    const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
        const newLocation = { lat: event.lngLat.lat, lng: event.lngLat.lng }
        setCurrentLocation(newLocation)
        form.setValue('location', `${newLocation.lat}, ${newLocation.lng}`)
    }, [form]);

    // フォームの送信
    const onSubmit = useCallback(
        async (values: z.infer<typeof formSchema>) => {
            const supabase = createClient()
            const { error } = await supabase
                .from('lost-items')
                .insert({
                    title: values.title,
                    description: values.description,
                    location: `POINT(${currentLocation?.lng ?? 0} ${currentLocation?.lat ?? 0})`,
                })
            if (error) {
                console.error("Error inserting lost item:", error)
                return
            }
            onSuccess?.()
        },
        [currentLocation, onSuccess],
    )

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>タイトル</FormLabel>
                                <FormControl>
                                    <Input placeholder="例：黒い財布" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>説明</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="例：ブランド名や特徴など"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={() => (
                            <FormItem>
                                <FormLabel>場所</FormLabel>
                                <FormControl>
                                    <div className="w-full h-[300px] overflow-hidden rounded-lg">
                                        <Map
                                            initialViewState={{
                                                longitude: currentLocation?.lng ?? 139.6503,
                                                latitude: currentLocation?.lat ?? 35.6764,
                                                zoom: 15
                                            }}
                                            style={{ width: '100%', height: '100%' }}
                                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                                        >
                                            {currentLocation && (
                                                <Marker
                                                    longitude={currentLocation.lng}
                                                    latitude={currentLocation.lat}
                                                    color="#FF0000"
                                                    draggable={true}
                                                    onDragEnd={onMarkerDragEnd}
                                                />
                                            )}
                                        </Map>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        報告する
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default LostItemForm