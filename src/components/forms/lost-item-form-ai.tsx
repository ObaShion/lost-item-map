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
import { Textarea } from "@/components/ui/textarea"
import React, { useCallback, useEffect, useState } from "react"
import { Map, Marker, MarkerDragEvent } from '@vis.gl/react-maplibre'

interface LostItemFormAIProps {
    onSuccess?: () => void
    selectedLocation?: { lat: number; lng: number } | null
}

const LostItemFormAI: React.FC<LostItemFormAIProps> = ({ onSuccess, selectedLocation: initialLocation }) => {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(initialLocation ?? null)

    // フォームのスキーマ
    const formSchema = z.object({
        description: z.string().min(1, "説明を入力してください"),
        location: z.string().min(1, "場所を設定してください"),
    });

    // フォームの初期値
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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

    // フォームの送信
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("onSubmit called", values)
        onSuccess?.()
    }
    
    // マーカーをドラッグした時の処理
    const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
        const newLocation = { lat: event.lngLat.lat, lng: event.lngLat.lng }
        setCurrentLocation(newLocation)
        form.setValue('location', `${newLocation.lat}, ${newLocation.lng}`)
    }, [form]);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>落とし物の説明</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="例：駅の改札口で黒い財布を見つけました。ブランドはルイ・ヴィトンで、中に現金が入っていました。"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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
                        AIで分析して報告
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default LostItemFormAI 