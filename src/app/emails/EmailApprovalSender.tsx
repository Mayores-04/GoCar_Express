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

interface EmailApprovalSenderProps {
  userFirstName: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const EmailApprovalSender = ({ userFirstName }: EmailApprovalSenderProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your reservation has been approved</Preview>
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
                src={`${baseUrl}/static/approved-header.png`}
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" }}>
                  Hi {userFirstName},
                </Heading>
                <Heading as="h2" style={{ fontSize: 26, fontWeight: "bold", textAlign: "center" }}>
                  We're excited to let you know that your reservation has been approved! 🎉
                </Heading>

                <Text style={paragraph}>
                  We look forward to providing you with a great experience. If you have any questions, feel free to contact us.
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

export default EmailApprovalSender;

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
  backgroundColor: "#28a745",
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
