// src/Hook/useSubscription.ts
'use client';
import { useState, useEffect } from 'react';
import { Service } from '@/src/lib/schemas/services';
import { Subscription, SubscriptionWithService } from '@/src/lib/schemas/subscription';
import { fetchAllSubscriptions } from '@/src/lib/api';

export const useSubscription = (userId: string | undefined, services: Service[]) => {
    const [subscriptionServices, setSubscriptionServices] = useState<SubscriptionWithService[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [servicesIds, setServicesIds] = useState<number[]>([]);

    // Initialiser les IDs des services
    useEffect(() => {
        if (services.length > 0) {
            const ids = services.map(service => service.id);
            setServicesIds(ids);
        }
    }, [services]);

    // Récupérer tous les abonnements et filtrer ceux de l'utilisateur
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Récupérer tous les abonnements
                const allSubscriptions = await fetchAllSubscriptions();
                setSubscriptions(allSubscriptions);

                // 2. Filtrer les abonnements pour l'utilisateur et les services donnés
                const userSubscriptions = allSubscriptions.filter(sub =>
                    sub.user_id === Number(userId) &&
                    servicesIds.includes(sub.service_id)
                );

                // 3. Créer userSubscriptionsWithService en combinant avec les services
                const userSubscriptionsWithService = userSubscriptions.map(sub => {
                    // Trouver le service correspondant
                    const service = services.find(s => s.id === sub.service_id) ?? {
                        id: 0,
                        name: '',
                        price: 0,
                        unit: '',
                        icon: '',
                        route: '',
                        description: '',
                        is_active: true,
                    };

                    // Retourner un nouvel objet qui combine l'abonnement et le service
                    return {
                        ...sub, // Toutes les propriétés de l'abonnement
                        service: service // Ajouter le service correspondant
                    };
                });

                // 4. Mettre à jour l'état avec les abonnements enrichis
                setSubscriptionServices(userSubscriptionsWithService);
            } catch (error) {
                console.error("Erreur lors de la récupération des abonnements:", error);
            }
        };

        if (userId && servicesIds.length > 0) {
            fetchData();
        }
    }, [userId, servicesIds, services]); // Dépendances correctes

    return { subscriptions, subscriptionServices };
};
