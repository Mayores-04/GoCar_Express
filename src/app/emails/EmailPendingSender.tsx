import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  interface EmailPendingNotificationProps {
    userFirstName: string;
    pendingReason: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  
  const EmailPendingNotification = ({ userFirstName, pendingReason }: EmailPendingNotificationProps) => {
    return (
      <Html>
        <Head />
        <Preview>Your reservation is pending</Preview>
        <Body style={main}>
          <Container>
            <Section style={logo}>
              <Img src={`${baseUrl}/static/your-logo.png`} />
            </Section>
  
            <Section style={content}>
              <Row>
                <Img
                  style={image}
                  width={620}
                  src={`${baseUrl}/static/pending-header.png`}
                />
              </Row>
  
              <Row style={{ ...boxInfos, paddingBottom: "0" }}>
                <Column>
                  <Heading style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" }}>
                    Hi {userFirstName},
                  </Heading>
                  <Heading as="h2" style={{ fontSize: 26, fontWeight: "bold", textAlign: "center" }}>
                    Your reservation request is currently pending. ⏳
                  </Heading>
  
                  <Text style={paragraph}>
                    The reason for this status is: <strong>{pendingReason}</strong>.
                  </Text>
  
                  <Text style={{ ...paragraph, marginTop: -5 }}>
                    We will notify you as soon as the status of your reservation changes. Thank you for your patience!
                  </Text>
                </Column>
              </Row>
  
              <Row style={{ ...boxInfos, paddingTop: "0" }}>
                <Column style={containerButton} colSpan={2}>
                  <Button style={button}>View Reservation</Button>
                </Column>
              </Row>
            </Section>
  
            <Section style={containerImageFooter}>
              <Img
                style={image}
                width={620}
                src={`${baseUrl}/static/footer.png`}
              />
            </Section>
  
            <Text style={{ textAlign: "center", fontSize: 12, color: "rgb(0,0,0, 0.7)" }}>
              © 2022 | Your Company. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default EmailPendingNotification;
  
  // Styles
  
  const main = {
    backgroundColor: "#fff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const paragraph = {
    fontSize: 16,
  };
  
  const logo = {
    padding: "30px 20px",
  };
  
  const containerButton = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };
  
  const button = {
    backgroundColor: "#007bff",
    borderRadius: 3,
    color: "#FFF",
    fontWeight: "bold",
    border: "1px solid rgb(0,0,0, 0.1)",
    cursor: "pointer",
    padding: "12px 30px",
  };
  
  const content = {
    border: "1px solid rgb(0,0,0, 0.1)",
    borderRadius: "3px",
    overflow: "hidden",
  };
  
  const image = {
    maxWidth: "100%",
  };
  
  const boxInfos = {
    padding: "20px",
  };
  
  const containerImageFooter = {
    padding: "45px 0 0 0",
  };
  