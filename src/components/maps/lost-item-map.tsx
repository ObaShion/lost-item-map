'use client'
import { Map, Marker } from '@vis.gl/react-maplibre'
import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, MapPin } from 'lucide-react'
import LostItemForm from '@/components/forms/lost-item-form'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { motion } from 'motion/react'
import { createClient } from '@/utils/supabase/client'

interface LostItem {
    id: number
    title: string
    description: string
    lat: number
    lng: number
    is_find: boolean
}

const LostItemMap: React.FC = () => {
    const [items, setItems] = useState<LostItem[]>([])
    const [selectedPin, setSelectedPin] = useState<{
        id: number
        title: string
        description: string
        lat: number
        lng: number
        is_find: boolean
    } | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number
        lng: number
    } | null>(null)
    const [isReporting, setIsReporting] = useState(false)

    const handleMapClick = useCallback(
        (e: { lngLat?: { lat: number; lng: number } }) => {
            if (!isReporting || !e.lngLat) return
            setSelectedLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng })
            setIsFormOpen(true)
            setIsReporting(false)
        },
        [isReporting],
    )

    function handleReportClick() {
        setIsReporting(true)
        setSelectedLocation(null)
    }

    function handleCancel() {
        setIsReporting(false)
        setSelectedLocation(null)
    }

    const dataFetch = () => {
        const supabase = createClient()
        supabase
            .from('lost-items')
            .select('id, title, description, location')
            .eq('is_find', 'False')
            .then(({ data, error }) => {
                if (error || !data) return
                const parsed: LostItem[] = data.map(item => {
                    let lng = 0,
                        lat = 0
                    if (typeof item.location === 'string') {
                        const [x, y] = item.location
                            .replace(/^POINT\(|\)$/g, '')
                            .split(' ')
                        lng = parseFloat(x)
                        lat = parseFloat(y)
                    } else if (item.location?.coordinates) {
                        ;[lng, lat] = item.location.coordinates
                    }
                    return {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        lng,
                        lat,
                        is_find: false,
                    }
                })
                setItems(parsed)
            })
    }

    useEffect(() => {
        dataFetch()
    }, [])

    const handleMarkAsFound = async () => {
        if (!selectedPin) return
        
        const supabase = createClient()
        const { error } = await supabase
            .from('lost-items')
            .update({ is_find: true })
            .eq('id', selectedPin.id)
        
        if (!error) {
            dataFetch()
            setSelectedPin(null)
        }
    }

    return (
        <div className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Map
                    initialViewState={{ longitude: 139.956233496181, latitude: 35.83399348114067, zoom: 15 }}
                    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                    style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}
                    onClick={handleMapClick}
                >
                    {items.map(item => (
                        <Marker
                            key={item.id}
                            longitude={item.lng}
                            latitude={item.lat}
                            color="#FF0000"
                        >
                            <div
                                onClick={() =>
                                    setSelectedPin({
                                        id: item.id,
                                        title: item.title,
                                        description: item.description,
                                        lat: item.lat,
                                        lng: item.lng,
                                        is_find: item.is_find,
                                    })
                                }
                                className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
                            />
                        </Marker>
                    ))}
                </Map>
            </div>

            <Dialog open={selectedPin !== null} onOpenChange={() => setSelectedPin(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedPin?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedPin?.description}
                        </DialogDescription>
                    </DialogHeader>
                    {!selectedPin?.is_find && (
                        <Button 
                            onClick={handleMarkAsFound}
                            className="w-full mt-4"
                        >
                            見つかりました
                        </Button>
                    )}
                </DialogContent>
            </Dialog>

            {isReporting && (
                <motion.div
                    className="absolute top-6 right-5 left-5 sm:right-50 sm:left-50"
                    initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center gap-2 px-4 py-5 bg-white/90 rounded-xl shadow-lg border border-gray-200 backdrop-blur-md">
                        <MapPin className="text-blue-500 w-6 h-6 sm:w-5 sm:h-5" />
                        <span className="font-semibold text-base sm:text-base text-gray-800">
              地図上の場所をタップしてください
            </span>
                    </div>
                </motion.div>
            )}

            <div className="absolute bottom-0 right-0 mb-11 mr-4 flex flex-col items-end space-y-5">
                {!isReporting ? (
                    <Button size="lg" className="rounded-full shadow-lg" onClick={handleReportClick}>
                        落とし物を報告
                        <Plus className="h-6 w-6 ml-2" />
                    </Button>
                ) : (
                    <Button
                        variant="destructive"
                        size="lg"
                        className="rounded-full shadow-lg"
                        onClick={handleCancel}
                    >
                        キャンセル
                    </Button>
                )}
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>落とし物を報告</DialogTitle>
                        <DialogDescription>
                            見つけた落とし物の情報を入力してください。
                        </DialogDescription>
                    </DialogHeader>
                    <LostItemForm
                        onSuccess={() => {
                            dataFetch()
                            setIsFormOpen(false)
                        }}
                        selectedLocation={selectedLocation}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LostItemMap