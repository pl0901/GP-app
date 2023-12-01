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
  const getUserCamera = () => {
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


  useEffect(() => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]).then(res => {
      getUserCamera();
      console.log('Camera on')
    }).then(res => {
      faceRecognition()
      console.log('face')
    })
  }, [videoRef]);

  
  const getLabel = () => {
    const labels = ['eunnho', 'gawon']
    return Promise.all(
      labels.map(async label => {
        const desc = [];
        const image = await faceapi.fetchImage(`/labels/${label}.jpg`)
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
  
        desc.push(detection.descriptor)
        return new faceapi.LabeledFaceDescriptors(label, desc)
      })
    )
  }

  const faceRecognition = async () => {
    const labeledFaceDescritors = await getLabel()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescritors)
    console.log('video', videoRef)
    videoRef.current.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(videoRef.current)
      canvas.style.cssText = "position: absolute; top: 90px; left: 70px;";
      document.body.append(canvas)
      console.log(videoRef.current.clientWidth, videoRef.current.clientHeight)
      const displaySize = {width: videoRef.current.clientWidth, height: videoRef.current.clientHeight}
      faceapi.matchDimensions(canvas, displaySize)

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        const results = resizedDetections.map(d => {
          return faceMatcher.findBestMatch(d.descriptor)
        })
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box
          const drawBox = new faceapi.draw.DrawBox(box, {label: result})
          drawBox.draw(canvas)
        })

      }, 100)
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
