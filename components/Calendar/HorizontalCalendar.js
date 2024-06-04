import { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View,
    ScrollView, FlatList, TouchableOpacity,
    Dimensions, ScaledSize
} from 'react-native';
import moment, { months } from 'moment';
import DateList from './DateList';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HorizontalCalender = ({ onSelectDate, selected }) => {
    const [dates, setDates] = useState([])
    const [scrollPosition, setScrollPosition] = useState(0)
    const [currentMonth, setCurrentMonth] = useState()

    // get the dates from today to 10 days from now, format them as strings and store them in state
    const getDates = () => {
        const _dates = []
        for (let i = 0; i < 10; i++) {
            const date = moment().add(i, 'days')
            _dates.push(date)
        }
        setDates(_dates)
    }

    const getCurrentMonth = () => {
        const currentMonth = moment(dates[0]).add(scrollPosition / 60, 'days').format('MMMM')
        const currentYear = moment(dates[0]).add(scrollPosition / 60, 'days').format('YYYY');
        const displayText = currentMonth + currentYear;
        setCurrentMonth(currentMonth)
    }

    useEffect(() => {
        getDates()
        getCurrentMonth()
    }, [])

    const handleNextMonth = () => {
        const nextMonthStartDate = moment(dates[0])
            .add(1, 'month')
            .startOf('month');
        const daysInNextMonth = nextMonthStartDate.daysInMonth();
        setScrollPosition(0);
        getDates(); // Update the dates array with the next month's dates
        // Set the scroll position to the first day of the next month
        setScrollPosition(nextMonthStartDate.date() - 1);
    }


    return (
        <>
            <View style={styles.centered}>
                <FontAwesome name="angle-left" size={24} color="black" style={styles.monthBtn} />
                <Text style={styles.title}>{currentMonth}</Text>
                <FontAwesome name="angle-right" size={24} color="black" style={styles.monthBtn} onPress={handleNextMonth} />
            </View>
            <View style={styles.dateSection}>
                <View style={styles.scroll}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {dates.map((date, index) => (
                            <DateList
                                key={index}
                                date={date}
                                onSelectDate={onSelectDate}
                                selected={selected}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </>
    )
}

export default HorizontalCalender;

const styles = StyleSheet.create({
    centered: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    monthBtn: {
        marginHorizontal: 50,
        paddingHorizontal: 20,
    },
    dateSection: {
        width: '100%',
        paddingHorizontal: 5,
        marginVertical: 5,
    },
    scroll: {

    },
})