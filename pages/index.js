// 로비폰 페이지

import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaAsterisk, FaHashtag, FaBell } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { ImCross } from 'react-icons/im';
import * as faceapi from 'face-api.js'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const videoRef = useRef(null);
  const router = useRouter();
  const getUserCamera = () => { // 카메라를 얻어오는 함수 카메라에 내 얼굴 stream이 보여지는 함수. 웹캠이 화면 스트림 정보를 가져오는 함수
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false
      })
      .then((stream) => {
        //비디오 tag에 stream 추가

        videoRef.current.srcObject = stream;

      })
      .catch((error) => {
        console.log(error);
      });
  };


  useEffect(() => { // useEffect가 페이지가 실행되고 제일 처음 실행되는 함수. 웹캠이 켜진다고 해도 학습시킨 모델을 가져와야 하기 때문에 
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'), // loadFromUri에서 모델 가져오고 
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]).then(res => { // 가져오면 카메라 켜라
      getUserCamera();
      console.log('Camera on')
    }).then(res => { // 그다음 face 인식을 해라 
      faceRecognition() // 이게 메인인데... 
      console.log('face')
    })
  }, [videoRef]);

  
  const getLabel = async () => { // 우리가 넣은 사진을 바탕으로 학습하는 부분
    const labels = await fetch('http://localhost:3000/api/getList') // lables 폴더에 있는 애들들 가져오고
    const data = await labels.json()
    return Promise.all(
      data.map(async label => {
        const desc = [];
        const image = await faceapi.fetchImage(`/labels/${label}.jpg`) // 사진을 불러오고
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor() // detectSingleFace : label 폴더에 있는 사진 바탕으로 학습한다
  
        desc.push(detection.descriptor)
        return new faceapi.LabeledFaceDescriptors(label, desc) // 학습 끝나면 내 이름을 desc에 넣는것. 학습 끝났으니까 라벨붙이는것
      })
    )
  }

  const faceRecognition = async () => {
    const labeledFaceDescritors = await getLabel() // 제일 처음 getLable 이거 실행
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescritors) // FaceMatcher 웹캠 화면이랑 라벨이랑 매칭하는함수
    console.log('video', videoRef)
    videoRef.current.addEventListener('play', () => { // videoRef.current : canvas에 대한 style 정의 (크기 높이 정의)
      const canvas = faceapi.createCanvasFromMedia(videoRef.current) // canvas : 웹캠 화면에 네모 네모 빔
      canvas.style.cssText = "position: absolute; top: 90px; left: 70px;";
      document.body.append(canvas)
      console.log(videoRef.current.clientWidth, videoRef.current.clientHeight)
      const displaySize = {width: videoRef.current.clientWidth, height: videoRef.current.clientHeight}
      faceapi.matchDimensions(canvas, displaySize)

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors() // detectAllFaces 0.1초 간격으로 얼굴 트래킹 함
        const resizedDetections = faceapi.resizeResults(detections, displaySize) //resizedDetections 얼굴 사이즈 맞춰서 사각형 만들어주는것. canvas가 얼굴 움직임 따라가는거
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        const results = resizedDetections.map(d => {
          return faceMatcher.findBestMatch(d.descriptor)
        })
        results.forEach((result, i) => { // 실행하면 canvas가 막 여러개 뜨는데, 실시간으로 트래킹 하는건데 , results가 canvas들의 배열
          const box = resizedDetections[i].detection.box
          const drawBox = new faceapi.draw.DrawBox(box, {label: result}) 
          drawBox.draw(canvas)
        })

      }, 100) // setInterval: 0.1초 간격으로 함수를 실행하는, 얼굴 끊임없이 찾을수 있게
    })
  }


  return (
    <Box>
      <VStack
        m="0 auto"
        border="1px solid black"
        w="95vw"
        h="85vh"
        spacing={0}
        mt="12px"
      >
        <Box w="100%" h="8%" bgColor="rgba(39, 39, 39, 1)" />
        <HStack
          w="100%"
          h="80%"
          border="1px solid black"
          spacing={0}
          borderTop="10px solid rgba(190, 190, 190, 0.5)"
          borderBottom="10px solid rgba(190, 190, 190, 0.5)"
        >
          <VStack
            bgColor="#1B1919"
            w="60%"
            h="100%"
            py="36px"
            border="1px solid black"
            justifyContent="space-between"
            borderRight="10px solid rgba(105, 105, 105, 0.5)"
          >
            {/* 웹캠 */}
            <Box w="80%" h="60%" border="1px solid black">
              <video ref={videoRef} autoPlay></video>
            </Box>
            <Box w="48px" h="28px" border="1px solid black" />
          </VStack>
          <VStack
            bgColor="#707070"
            w="40%"
            h="100%"
            border="1px solid black"
            justifyContent="center"
            spacing='12px'
          >
            <Box
              w="120px"
              h="120px"
              backgroundImage="url('/images/lens.png')"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
            />
            <Box
              w="8px"
              h="8px"
              borderRadius="100%"
              border="1px solid black"
              bgColor="black"
            />
            <VStack w="60%" h="50%">
              <HStack w="80%" h="20%" justify="space-evenly">
                <Button fontSize="2xl" w="48px" h="48px">
                  1
                </Button>
                <Button fontSize="2xl" w="48x" h="48px">
                  2
                </Button>
                <Button fontSize="2xl" w="48x" h="48px">
                  3
                </Button>
              </HStack>
              <HStack w="80%" h="20%" justify="space-evenly">
                <Button fontSize="2xl" w="48px" h="48px">
                  4
                </Button>
                <Button fontSize="2xl" w="48px" h="48px">
                  5
                </Button>
                <Button fontSize="2xl" w="48px" h="48px">
                  6
                </Button>
              </HStack>
              <HStack w="80%" h="20%" justify="space-evenly">
                <Button fontSize="2xl" w="48px" h="48px">
                  7
                </Button>
                <Button fontSize="2xl" w="48px" h="48px">
                  8
                </Button>
                <Button fontSize="2xl" w="48px" h="48px">
                  9
                </Button>
              </HStack>
              <HStack w="80%" h="20%" justify="space-evenly">
                <IconButton icon={<FaAsterisk />} w="48px" h="48px" />

                <Button fontSize="2xl" w="48px" h="48px">
                  0
                </Button>
                <IconButton icon={<FaHashtag />} w="48px" h="48px" />
              </HStack>
              <HStack w="80%" h="20%" justify="space-evenly">
                <IconButton icon={<FaBell />} w="48px" h="48px" />
                <IconButton icon={<IoPersonSharp />} w="48px" h="48px" />
                <IconButton icon={<ImCross />} w="48px" h="48px" />
              </HStack>
            </VStack>
          </VStack>
        </HStack>
        <Box w="100%" h="12%" bgColor="rgba(39, 39, 39, 1)" />
      </VStack>
      <Button
        m="0 auto"
        display="block"
        mt="24px"
        w="30%"
        h="64px"
        fontSize="xl"
        onClick={() => {
          router.push('/security');
        }}
      >
        경비실 페이지
      </Button>
    </Box>
  );
}

export default Index;
