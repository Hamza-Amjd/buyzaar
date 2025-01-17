import Header from '@/components/ui/Header';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, StyleSheet, FlatList, useColorScheme } from 'react-native';

const TrackOrder = () => {
  const colorScheme = useColorScheme();

  // Mock data for order tracking
  const orderStatus = 'In Transit';
  const estimatedDelivery = 'May 15, 2023';
  const trackingEvents = [
    { id: '1', status: 'Order Placed', date: 'May 10, 2023' },
    { id: '2', status: 'Order Processed', date: 'May 11, 2023' },
    { id: '3', status: 'Shipped', date: 'May 12, 2023' },
    { id: '4', status: 'In Transit', date: 'May 13, 2023' },
  ];
  //@ts-ignore
  const renderTrackingEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDot} />
      <View style={styles.eventContent}>
        <ThemedText style={styles.eventStatus}>{item.status}</ThemedText>
        <ThemedText style={styles.eventDate}>{item.date}</ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Header title='Track Order' />
      
        <ThemedText type='heading'>Status: {orderStatus}</ThemedText>
        <ThemedText type='subtitle'>
          Estimated Delivery: {estimatedDelivery}
     </ThemedText>
     <View style={styles.content}>  
        <ThemedText type='defaultSemiBold'>Order Timeline</ThemedText>
        <FlatList
          data={trackingEvents}
          renderItem={renderTrackingEvent}
          keyExtractor={(item) => item.id}
          style={styles.timeline}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeline: {
    flex: 1,
    padding:10
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
    marginRight: 10,
    marginTop: 5,
  },
  eventContent: {
    flex: 1,
  },
  eventStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    color: 'grey'
  },
});

export default TrackOrder;
