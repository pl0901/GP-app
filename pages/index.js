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

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const videoRef = useRef(null);
  const router = useRouter();
  const getUserCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        //비디오 tag에 stream 추가
        let video = videoRef.current;

        video.srcObject = stream;

        video.play();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserCamera();
  }, [videoRef]);
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
              <video ref={videoRef}></video>
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
