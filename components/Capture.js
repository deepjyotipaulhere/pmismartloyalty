import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, List, Paragraph, Text, Title } from 'react-native-paper'
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios'
import { Image, AsyncStorage, ScrollView } from 'react-native';
// import { FormRecognizerClient, AzureKeyCredential } from '@azure/ai-form-recognizer'
import fs from 'react-native-fs'
import cloudinary from 'cloudinary-core'
// import imgur from 'imgur'
export default class Capture extends React.Component {
    state = {
        image: null,
        uploading: false,
        doc: null,
        totalpoint: 0
    }
    async componentDidMount() {

    }
    render() {
        return (
            <SafeAreaView>

                <ScrollView>
                    {
                        !this.state.image && <Button mode='contained' onPress={() => {
                            ImagePicker.showImagePicker(
                                {
                                    // noData: true,
                                    title: 'Select receipt photo',
                                    quality: 0.5,
                                    storageOptions: {
                                        skipBackup: true,
                                        path: 'images',
                                    },
                                },
                                response => {
                                    if (response.didCancel) {
                                        console.log('User cancelled image picker');
                                    } else this.setState({ image: response });
                                },
                            );
                        }}>Pick a Receipt</Button>
                    }
                    {
                        this.state.image && <Card>
                            <Card.Title title="Scan Receipt" subtitle="Upload a receipt to scan items" />
                            <Card.Cover source={{ uri: this.state.image.uri }} />
                            <Card.Actions>
                                <Button>Cancel</Button>
                                <Button onPress={async () => {
                                    this.setState({ uploading: true })
                                    RNFetchBlob.fetch(
                                        'POST',
                                        'https://smartloyalty.cognitiveservices.azure.com/formrecognizer/v2.0/prebuilt/receipt/analyze?includeTextDetails=true',
                                        {
                                            'Content-Type': 'application/octet-stream',
                                            'Ocp-Apim-Subscription-Key': '2309e5f9600145559ef6fd86cece462b',
                                        },
                                        'RNFetchBlob-' + this.state.image.uri,
                                    )
                                        .then(res => {
                                            var str = res.respInfo.headers['Operation-Location'].split("/")
                                            return str
                                        }).then((str) => {
                                            setTimeout(() => {
                                                RNFetchBlob.fetch('GET', "https://smartloyalty.cognitiveservices.azure.com/formrecognizer/v2.0/prebuilt/receipt/analyzeResults/" + str[str.length - 1],
                                                    // axios.get("https://smartloyalty.cognitiveservices.azure.com/formrecognizer/v2.0/prebuilt/receipt/analyzeResults/" + str[str.length - 1], {
                                                    {
                                                        'Ocp-Apim-Subscription-Key': '2309e5f9600145559ef6fd86cece462b',
                                                        'Content-Type': 'application/json',
                                                    }
                                                ).then(response => {
                                                    console.log(response);
                                                    setTimeout(() => {
                                                        this.setState({ uploading: false, doc: response.json().analyzeResult.documentResults[0] });
                                                        console.log(this.state.doc);
                                                        var t = 0
                                                        this.state.doc.fields.Items.valueArray.map(i => {
                                                            t = t + parseFloat(i.valueObject.TotalPrice.text)
                                                        })
                                                        this.setState({ totalpoint: t })
                                                    }, 1000);
                                                })
                                            }, 1500);
                                        })
                                        .catch(err1 => {
                                            this.setState({ uploading: false });
                                            console.log('Image upload failed! ' + err1);
                                        });
                                }}>Fetch Details</Button>
                            </Card.Actions>
                        </Card>
                    }
                    {
                        this.state.doc &&
                        <SafeAreaView>
                            {this.state.doc.fields.MerchantName && <List.Item
                                title="Merchant Name"
                                description={this.state.doc.fields.MerchantName.text ? this.state.doc.fields.MerchantName.text : 'Could not detect'}
                            />}
                            {
                                this.state.doc.fields.Items.valueArray.map(i => <List.Item key={i.base64}
                                    title={i.valueObject.Name.valueString}
                                    description={i.valueObject.TotalPrice.text}
                                />)
                            }
                            <List.Item
                                title="Total"
                                description={this.state.totalpoint}
                            />
                            <Button mode='contained' onPress={() => {
                                console.log(this.props.navigation.navigate("Purchase"));
                                setTimeout(() => {
                                    this.props.navigation.navigate("Points", {
                                        item: { name: this.state.doc.fields.MerchantName.text, point: parseFloat(this.state.totalpoint * 0.1).toFixed(2) }
                                    })
                                }, 500);

                            }}>Add {parseFloat(this.state.totalpoint * 0.1).toFixed(2)} to Loyalty Points</Button>
                        </SafeAreaView>
                    }

                </ScrollView>
            </SafeAreaView>
        )
    }
}