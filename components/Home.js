import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, List } from 'react-native-paper'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { AsyncStorage, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';


export default class Home extends React.Component {
    state = {
        item: [{ "name": "McDonalds", "point": 40 }],
        newitem: {},
        total: 0
    }
    UNSAFE_componentWillMount() {




    }
    componentDidMount() {
        this.props.navigation.addListener("focus", () => {
            try {
                // Call ur function here.. or add logic.     
                var it = this.state.item
                it.push(this.props.route.params.item)
                this.setState({ item: it })
                var t = 0
                this.state.item.map(i => {
                    t = parseFloat(t) + parseFloat(i.point).toFixed(2)
                })
                this.setState({ total: t })
                this.render()
            } catch (ex) { }
        });

        // try {
        //     console.log(this.props.route.params.item);
        // } catch (ex) { }
        // var t = 0
        // this.state.item.map(i => {
        //     t = t + i.point
        // })
        // this.setState({ total: t })
        // setTimeout(() => {

        //     this.render()
        // }, 1000);

        setTimeout(() => {
            try {

                this.setState({ newitem: this.props.route.params.item }, () => {
                    console.log(this.state.newitem);
                })
                console.log(this.props.route.params.item);
                var it = this.state.item
                it.push(this.props.route.params.item)
                this.setState({ item: it })
                var t = 0
                this.state.item.map(i => {
                    t = t + i.point
                })
                this.setState({ total: t })
                this.render()
            } catch (ex) {
                console.log(ex);
            }
        }, 5000);
    }
    render() {
        // const isFocused = useIsFocused();
        // console.log(isFocused);
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 25 }}>My Loyalty Points</Text>
                        <AnimatedCircularProgress
                            size={200}
                            width={10}
                            fill={40}
                            tintColor="#0074c2"
                            style={{ marginTop: 20 }}
                            arcSweepAngle={270}
                            rotation={225}
                            backgroundColor="#ccc">
                            {
                                (fill) => (
                                    <>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                                            {40}
                                        </Text>
                                        <Text style={{ fontSize: 20, color: '#aaa' }}>
                                            {'/' + 100}
                                        </Text>
                                    </>
                                )
                            }
                        </AnimatedCircularProgress>
                        <Text>Level 1</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center',marginTop:25 }}>
                        <Text style={{fontSize:25,fontWeight:'bold'}}>Offline Purchases</Text>
                    </View>
                    {
                        this.state.item.map(i => <List.Item key={i.point} style={{borderBottomWidth:1,borderBottomColor:'#ccc'}}
                            title={i.name}
                            description={i.point}
                        />)
                    }
                </ScrollView>
            </SafeAreaView>
        )
    }
}