import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAppStore } from '@/state/store';
import { SCENES } from '@/utils/constants';
import { useTheme } from '@/context/AppTheme';

interface SceneSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export default function SceneSelector({ visible, onClose }: SceneSelectorProps) {
    const { theme } = useTheme() as any;
    const { currentSceneId, setCurrentSceneId } = useAppStore();

    const renderItem = ({ item }: { item: any }) => {
        const isSelected = currentSceneId === item.id;
        return (
            <TouchableOpacity
                style={[styles.itemContainer, isSelected && { borderColor: theme.primary, borderWidth: 2 }]}
                onPress={() => {
                    setCurrentSceneId(item.id);
                    // Optional: Close on select? Or keep open to browse?
                    // onClose(); 
                }}
            >
                <Image source={item.image} style={styles.thumbnail} />
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{item.name}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={16} color={theme.primary} style={{ marginLeft: 4 }} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <BlurView intensity={80} tint="dark" style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Choose Environment</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={SCENES}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.listContent}
                    />
                </BlurView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        height: '60%',
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    closeBtn: {
        padding: 4,
    },
    listContent: {
        padding: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    itemContainer: {
        width: '48%',
        aspectRatio: 1.5,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#333',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    labelContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    }
});
