import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  Image,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

function Security() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [toggle, setToggle] = useState(0);
  const [result, setResult] = useState([]);
  const onUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = () => {
        console.log(reader.result);
        setImageSrc(reader.result || null);
        resolve();
      };
    });
  };

  const onSave = (e) => {
    const data = {
      image: imageSrc,
      name: name,
      room: room,
    };
    const res = fetch('http://localhost:4000/regist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => setToggle((prev) => prev + 1))
      .then((res) => {
        onClose();
        setImageSrc(null);
      });
  };

  const onDelete = (idx) => {
    const res = fetch(`http://localhost:4000/regist/${idx}`, {
      method: 'DELETE',
    }).then((res) => setToggle((prev) => prev + 1));
  };

  useEffect(() => {
    const getData = async () => {
      const res = await fetch('http://localhost:4000/regist');
      const data = await res.json();
      console.log(data);
      setResult([]);
      setResult(data);
      console.log(result);
    };
    getData();
  }, [toggle]);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>세대원 등록</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing="24px">
              <VStack h="200px">
                {imageSrc !== null && <Image src={imageSrc} boxSize="150px" />}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onUpload(e)}
                />
              </VStack>
              <VStack h="200px" justify="space-evenly">
                <Input
                  placeholder="이름"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Input
                  placeholder="호수"
                  onChange={(e) => {
                    setRoom(e.target.value);
                  }}
                />
              </VStack>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSave}>저장하기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Card w="70%" m="0 auto">
        <CardHeader>
          <HStack justify="space-between">
            <Text fontSize="2xl" fontWeight="bold">
              세대원 목록
            </Text>
            <IconButton icon={<FaPlus />} onClick={onOpen} />
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack>
            {result.map((item, idx) => (
              <HStack justify="space-evenly" w="80%" key={idx}>
                <Avatar size="md" src={item.image} />
                <Text fontSize="xl">{item.room}</Text>
                <Text fontSize="xl">{item.name}</Text>
                <IconButton
                  icon={<FaTrash />}
                  colorScheme="red"
                  borderRadius="100%"
                  onClick={() => {
                    onDelete(item.id);
                  }}
                />
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </div>
  );
}

export default Security;
