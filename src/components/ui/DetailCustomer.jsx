import styled from "styled-components";
import { theme } from "./Theme";

//////////////////////////////////////////
// PAGE
//////////////////////////////////////////

export const Wrapper = styled.div`
  width: 100%;
  min-height: calc(100dvh - 90px);

  padding: 0 0 28px 0;

  background: ${theme.colors.background};

  @media (max-width: 900px) {
    padding: 20px;
  }
`;

//////////////////////////////////////////
// HEADER
//////////////////////////////////////////

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  margin-bottom: 24px;
`;

export const BackButton = styled.button`
  width: 42px;
  height: 42px;

  border-radius: 50%;
  border: 1px solid ${theme.colors.border};

  background: white;

  cursor: pointer;

  font-size: 18px;

  color: ${theme.colors.text};

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${theme.colors.primary};
  }
`;

export const Title = styled.h1`
  margin: 0;

  font-size: 28px;
  font-weight: 700;

  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// MAIN LAYOUT
//////////////////////////////////////////

export const Layout = styled.div`
  display: grid;

  grid-template-columns: 320px 1fr 300px;

  gap: 18px;

  align-items: start;

  @media (max-width: 1300px) {
    grid-template-columns: 320px 1fr;
  }

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

//////////////////////////////////////////
// BASE CARD
//////////////////////////////////////////

export const Card = styled.div`
  background: white;

  border-radius: 24px;

  border: 1px solid ${theme.colors.border};

  padding: 22px;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
`;

//////////////////////////////////////////
// CARD HEADER
//////////////////////////////////////////

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 20px;
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 15px;
  font-weight: 700;

  color: ${theme.colors.text};
`;

export const RedDot = styled.div`
  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: ${theme.colors.primary};
`;

//////////////////////////////////////////
// CLIENT
//////////////////////////////////////////

export const ClientTop = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  margin-bottom: 24px;
`;

export const Avatar = styled.img`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #fafafa;
  object-fit: cover;
  flex-shrink: 0;
`;

export const ClientName = styled.h2`
  margin: 0;

  font-size: 18px;
  font-weight: 700;

  color: ${theme.colors.text};
`;

export const ClientSubtext = styled.p`
  margin: 4px 0 0 0;

  font-size: 13px;

  color: ${theme.colors.textSecondary};
`;

//////////////////////////////////////////
// SECTIONS
//////////////////////////////////////////

export const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;

  margin-bottom: 14px;

  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// INFO
//////////////////////////////////////////

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;

  font-size: 13px;
`;

export const InfoLabel = styled.span`
  color: ${theme.colors.textSecondary};
`;

export const InfoValue = styled.span`
  font-weight: 600;

  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// STATS
//////////////////////////////////////////

export const StatsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 14px;

  margin-bottom: 18px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  min-height: 100px;

  border-radius: 18px;

  padding: 18px 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  background: ${({ $accent, $dark }) =>
    $accent
      ? theme.colors.primary
      : $dark
        ? "#111"
        : "#fff1f1"};

  color: ${({ $accent, $dark }) =>
    $accent || $dark
      ? "white"
      : theme.colors.primary};
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

export const StatLabel = styled.div`
  margin-top: 6px;

  font-size: 12px;

  opacity: 0.8;
`;

//////////////////////////////////////////
// DASHBOARD
//////////////////////////////////////////

export const DashboardBottom = styled.div`
  display: grid;

  grid-template-columns: 320px 1fr;

  gap: 18px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

//////////////////////////////////////////
// ACTIVITIES
//////////////////////////////////////////

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  font-size: 13px;
`;

export const ActivityLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ActivityDate = styled.span`
  color: ${theme.colors.textMuted};

  white-space: nowrap;
`;

//////////////////////////////////////////
// NOTES
//////////////////////////////////////////

export const NotesInput = styled.textarea`
  width: 100%;
  min-height: 160px;
  border-radius: 16px;
  border: 1px solid transparent;
  background: #fff5f5;
  padding: 16px;
  resize: vertical;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  transition: 0.2s ease;
  cursor: text;

  &:hover {
    border-color: ${theme.colors.border};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    cursor: text;
  }
`;

//////////////////////////////////////////
// TABLE
//////////////////////////////////////////

export const TableWrapper = styled.div`
  width: 100%;

  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;

  border-collapse: collapse;

  font-size: 13px;
`;

export const Th = styled.th`
  text-align: left;

  padding-bottom: 14px;

  color: ${theme.colors.textSecondary};

  font-weight: 600;

  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 14px 12px 14px 0;

  border-top: 1px solid #f3f3f3;

  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// CHAT
//////////////////////////////////////////

export const ChatBody = styled.div`
  height: 320px;

  border-radius: 16px;

  background: #fafafa;

  border: 1px solid ${theme.colors.border};
`;

export const ChatInputRow = styled.div`
  display: flex;
  gap: 10px;

  margin-top: 14px;
`;

export const ChatInput = styled.input`
  flex: 1;

  height: 46px;

  border-radius: 999px;

  border: 1px solid ${theme.colors.border};

  padding: 0 18px;

  outline: none;

  font-size: 14px;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const MicButton = styled.button`
  width: 46px;
  height: 46px;

  border-radius: 50%;

  border: none;

  background: ${theme.colors.primary};

  color: white;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

//////////////////////////////////////////
// MAP
//////////////////////////////////////////

export const Map = styled.div`
  width: 100%;
  height: 360px;

  border-radius: 18px;

  background:
    linear-gradient(
      135deg,
      #f2f2f2 25%,
      #e5e5e5 25%,
      #e5e5e5 50%,
      #f2f2f2 50%,
      #f2f2f2 75%,
      #e5e5e5 75%
    );

  background-size: 40px 40px;
`;