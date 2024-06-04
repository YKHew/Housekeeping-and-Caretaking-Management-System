import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        //flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 150,
        width: 150,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 100,
        marginTop: -90,
    },
    editImg: {
        alignItems: 'flex-end',
        top: -40,
        right: -40,
    },
    editImgbtn: {
        borderWidth: 1,
        borderRadius: 30,
        padding: 10,
        backgroundColor: '#0a75ad',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 5,
    },
    joinDate: {
        fontSize: 20,
        textAlign: 'center',
    },


    infoSection: {
        margin: 10,
        paddingHorizontal: 20,
        flexDirection: 'column',
    },
    
    //input field
    inputContainer: {
        flex: 1,
        marginVertical: 10,
    },
    inputRow: {
        flexDirection: 'row',
    },
    inputSingle: {

    },
    inputLabel: {
        margin: 10,
    },
    inputLabelText: {
        fontSize: 18,
        marginVertical: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderRadius: 10,
        borderColor: '#e6e6fa',
        fontSize: 16,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: '#000080',
        fontWeight: 'bold',
    },
    bottomBtnContainer: {
        
    },
    bottomBtn: {
        alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 50,
        //marginHorizontal: 50,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#0a75ad',
    },
    bottomBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },

})

export { styles }