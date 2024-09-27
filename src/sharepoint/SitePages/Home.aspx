<%@ Register TagPrefix="WpNs0" Namespace="Microsoft.SharePoint.Portal.WebControls" Assembly="Microsoft.SharePoint.Portal, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%-- _lcid="1033" _dal="1" --%>
    <%-- _LocalBinding --%>
        <%@ Page language="C#" MasterPageFile="../_catalogs/masterpage/React.master"
            Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c"
            meta:progid="SharePoint.WebPartPage.Document" meta:webpartpageexpansion="full" %>
            <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
                Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
                <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities"
                    Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"
                    %>
                    <%@ Import Namespace="Microsoft.SharePoint" %>
                        <%@ Assembly
                            Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"
                            %>
                            <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages"
                                Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"
                                %>
                                <asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
                                    <SharePoint:ListItemProperty Property="BaseName" maxlength="40" runat="server"/>
                                </asp:Content>
                                <asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
									<meta name="GENERATOR" content="Microsoft SharePoint" />
                                    <meta name="ProgId" content="SharePoint.WebPartPage.Document" />
                                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                                    <meta name="CollaborationServer" content="SharePoint Team Web Site" />
                                    <SharePoint:ScriptBlock runat="server">
                                        var navBarHelpOverrideKey = "WSSEndUser";
                                    </SharePoint:ScriptBlock>
                                    <SharePoint:StyleBlock runat="server">
                                        body #s4-leftpanel { display:none; } .s4-ca { margin-left:0px; } /*RhyBus
                                        Listview*/
                                    </SharePoint:StyleBlock>


                                    <link rel="stylesheet" href="../SiteAssets/assets/Css/RhyBusMaster.css" />
                                    <link rel="stylesheet" href="../SiteAssets/static/css/main.chunk.css" />
                                </asp:Content>
                                <asp:Content ContentPlaceHolderId="PlaceHolderSearchArea" runat="server">
									<SharePoint:FlightedContent runat="server"
                                        ExpFeature="Reserved_Server_ExpFeature30731" RenderIfInFlight="true">
                                        <SharePoint:SearchInNavBarEnabledContent runat="server" RenderIfEnabled="false">
                                            <SharePoint:DelegateControl runat="server"
                                                ControlId="SmallSearchInputBox" />
                                        </Sharepoint:SearchInNavBarEnabledContent>
                                        <SharePoint:SearchInNavBarEnabledContent runat="server" RenderIfEnabled="true">
                                            <SharePoint:WebTemplateBasedContent runat="server"
                                                WebTemplates="STS|BLANKINTERNET|CMSPUBLISHING|GROUP"
                                                RenderIfInWebTemplates="false">
                                                <SharePoint:DelegateControl runat="server"
                                                    ControlId="SmallSearchInputBox" />
                                            </SharePoint:WebTemplateBasedContent>
                                        </Sharepoint:SearchInNavBarEnabledContent>
                                    </SharePoint:FlightedContent>
                                    <SharePoint:FlightedContent runat="server"
                                        ExpFeature="Reserved_Server_ExpFeature30731" RenderIfInFlight="false">
                                        <SharePoint:DelegateControl runat="server" ControlId="SmallSearchInputBox" />
                                    </SharePoint:FlightedContent>
                                </asp:Content>
                                <asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">
									<SharePoint:ProjectProperty Property="Description" runat="server"/>
                                </asp:Content>
                                <asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
									<div class="ms-hide">
                                        <WebPartPages:WebPartZone runat="server" title="loc:TitleBar" id="TitleBar"
                                            AllowLayoutChange="false" AllowPersonalization="false" Style="display:none;"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
                                    </div>
                                    <!-- Html code start -->

                                    <!-- The react app injects itself into this div-->
                                    <div id="root"></div>

                                    <!-- Html code end-->
                                    <script src="../SiteAssets/static/js/runtime-main.js"></script>
                                    <script src="../SiteAssets/static/js/2.chunk.js"></script>
                                    <script src="../SiteAssets/static/js/main.chunk.js"></script>
                                    <!--<script
                                        src="<asp:Literal runat='server' Text='<% $SPUrl:~site/SiteAssets/static/js/runtime-main.js %>' __designer:Preview="/teams/products/ReactTemplate1Int/SiteAssets/static/js/runtime-main.js"
                                        __designer:Values="&lt;P N=&#39;Text&#39; Bound=&#39;True&#39; T=&#39;SPUrl:~site/SiteAssets/static/js/runtime-main.js&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl06&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
                                    "></script>
                                    <script
                                        src="<asp:Literal runat='server' Text='<% $SPUrl:~site/SiteAssets/static/js/2.chunk.js %>' __designer:Preview="/teams/products/ReactTemplate1Int/SiteAssets/static/js/2.chunk.js"
                                        __designer:Values="&lt;P N=&#39;Text&#39; Bound=&#39;True&#39; T=&#39;SPUrl:~site/SiteAssets/static/js/2.chunk.js&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl07&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
                                    "></script>
                                    <script
                                        src="<asp:Literal runat='server' Text='<% $SPUrl:~site/SiteAssets/static/js/main.chunk.js %>' __designer:Preview="/teams/products/ReactTemplate1Int/SiteAssets/static/js/main.chunk.js"
                                        __designer:Values="&lt;P N=&#39;Text&#39; Bound=&#39;True&#39; T=&#39;SPUrl:~site/SiteAssets/static/js/main.chunk.js&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl08&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
                                    "></script>-->

                                    <table class="ms-core-tableNoSpace ms-webpartPage-root" width="100%">
                                        <tr>
                                            <td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top"
                                                width="100%">
                                                <WebPartPages:WebPartZone runat="server" Title="loc:FullPage"
                                                    ID="FullPage" FrameType="TitleBarOnly"><ZoneTemplate>
<WpNs0:SiteFeedWebPart runat="server" __MarkupType="xmlmarkup" WebPart="true" __WebPartId="{4C866B30-8087-453F-9134-0A545F9CC7A2}" >
<WebPart xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/WebPart/v2">
  <Title>Site Feed</Title>
  <FrameType>None</FrameType>
  <Description>Site Feed contains microblogging conversations on a group site.</Description>
  <IsIncluded>true</IsIncluded>
  <ZoneID>FullPage</ZoneID>
  <PartOrder>2</PartOrder>
  <FrameState>Normal</FrameState>
  <Height />
  <Width />
  <AllowRemove>true</AllowRemove>
  <AllowZoneChange>true</AllowZoneChange>
  <AllowMinimize>true</AllowMinimize>
  <AllowConnect>true</AllowConnect>
  <AllowEdit>true</AllowEdit>
  <AllowHide>true</AllowHide>
  <IsVisible>true</IsVisible>
  <DetailLink />
  <HelpLink />
  <HelpMode>Modeless</HelpMode>
  <Dir>Default</Dir>
  <PartImageSmall />
  <MissingAssembly>Cannot import this Web Part.</MissingAssembly>
  <PartImageLarge />
  <IsIncludedFilter />
  <ExportControlledProperties>true</ExportControlledProperties>
  <ConnectionID>00000000-0000-0000-0000-000000000000</ConnectionID>
  <ID>g_e710da82_55bd_470c_8cfe_4ff3b4b35169</ID>
</WebPart>
</WpNs0:SiteFeedWebPart>
<WebPartPages:XsltListViewWebPart runat="server" ViewFlag="" ViewSelectorFetchAsync="False" InplaceSearchEnabled="False" ServerRender="False" ClientRender="False" InitialAsyncDataFetch="False" WebId="1e1c28db-a6d7-4596-8475-08da42304b99" IsClientRender="False" GhostedXslLink="main.xsl" ViewGuid="{F98F51DF-749C-4BF0-B882-8DAC833A2629}" EnableOriginalValue="False" ViewContentTypeId="0x" ListName="{A64EBC30-8C71-4CC6-B630-A48526FC93BF}" ListId="a64ebc30-8c71-4cc6-b630-a48526fc93bf" PageSize="-1" UseSQLDataSourcePaging="True" DataSourceID="" ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False" AutoRefresh="False" AutoRefreshInterval="60" Title="Documents" FrameType="Default" SuppressWebPartChrome="False" Description="" IsIncluded="True" PartOrder="4" FrameState="Normal" AllowRemove="True" AllowZoneChange="True" AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" CatalogIconImageUrl="/_layouts/15/images/itdl.png?rev=47" TitleUrl="/teams/products/ReactTemplate1Dev/Shared Documents" DetailLink="/teams/products/ReactTemplate1Dev/Shared Documents" HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="Cannot import this Web Part." PartImageLarge="/_layouts/15/images/itdl.png?rev=47" IsIncludedFilter="" ExportControlledProperties="False" ConnectionID="00000000-0000-0000-0000-000000000000" ID="g_9c5cd940_aa11_4073_b6d0_8b7b87e862d5" ExportMode="NonSensitiveData" __MarkupType="vsattributemarkup" __WebPartId="{F98F51DF-749C-4BF0-B882-8DAC833A2629}" __AllowXSLTEditing="true" __designer:CustomXsl="Fldtypes_mswhTitle.xsl;fldtypes_Ratings.xsl" WebPart="true" Height="" Width=""><ParameterBindings>
													<ParameterBinding Name="dvt_sortdir" Location="Postback;Connection"/>
													<ParameterBinding Name="dvt_sortfield" Location="Postback;Connection"/>
													<ParameterBinding Name="dvt_startposition" Location="Postback" DefaultValue=""/>
													<ParameterBinding Name="dvt_firstrow" Location="Postback;Connection"/>
													<ParameterBinding Name="OpenMenuKeyAccessible" Location="Resource(wss,OpenMenuKeyAccessible)" />
													<ParameterBinding Name="open_menu" Location="Resource(wss,open_menu)" />
													<ParameterBinding Name="select_deselect_all" Location="Resource(wss,select_deselect_all)" />
													<ParameterBinding Name="idPresEnabled" Location="Resource(wss,idPresEnabled)" />
													<ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noitemsinview_doclibrary)" />
													<ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noitemsinview_doclibrary_howto2)" />
												</ParameterBindings>
<DataFields>
</DataFields>
<XmlDefinition>
													<View Name="{A1B0922D-2880-456D-B24C-A6B76F02C4E0}" MobileView="TRUE" Type="HTML" Hidden="TRUE" DisplayName="" Url="/teams/products/ReactTemplate1Dev/SitePages/Home.aspx" Level="1" BaseViewID="50" ContentTypeID="0x" >
														<Query>
															<OrderBy>
																<FieldRef Name="Modified" Ascending="FALSE"/>
															</OrderBy>
														</Query>
														<ViewFields>
															<FieldRef Name="DocIcon"/>
															<FieldRef Name="LinkFilename"/>
														</ViewFields>
														<RowLimit Paged="TRUE">15</RowLimit>
														<JSLink>clienttemplates.js</JSLink>
														<XslLink Default="TRUE">main.xsl</XslLink>
														<Toolbar Type="Standard"/>
													</View>
												</XmlDefinition>
</WebPartPages:XsltListViewWebPart>

<WebPartPages:GettingStartedWebPart runat="server" BaseViewID="2" Title="Get started with your site" FrameType="None" SuppressWebPartChrome="False" Description="" IsIncluded="True" ZoneID="wpz" PartOrder="6" FrameState="Normal" AllowRemove="True" AllowZoneChange="True" AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" DetailLink="" HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="Cannot import this Web Part." PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="True" ConnectionID="00000000-0000-0000-0000-000000000000" ID="g_cf14bff0_33ed_43d9_b962_6c3aacdcf476" ChromeType="None" ExportMode="All" __MarkupType="vsattributemarkup" __WebPartId="{7636B749-6510-4068-95D2-B156653ACFFD}" WebPart="true" Height="" Width=""></WebPartPages:GettingStartedWebPart>


<WpNs0:SiteFeedWebPart runat="server" __MarkupType="xmlmarkup" WebPart="true" __WebPartId="{91F93EEF-7C23-4FE2-A9A2-5731BDFAD23D}" >
<WebPart xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/WebPart/v2">
  <Title>Site Feed</Title>
  <FrameType>None</FrameType>
  <Description>Site Feed contains microblogging conversations on a group site.</Description>
  <IsIncluded>true</IsIncluded>
  <ZoneID>wpz</ZoneID>
  <PartOrder>8</PartOrder>
  <FrameState>Normal</FrameState>
  <Height />
  <Width />
  <AllowRemove>true</AllowRemove>
  <AllowZoneChange>true</AllowZoneChange>
  <AllowMinimize>true</AllowMinimize>
  <AllowConnect>true</AllowConnect>
  <AllowEdit>true</AllowEdit>
  <AllowHide>true</AllowHide>
  <IsVisible>true</IsVisible>
  <DetailLink />
  <HelpLink />
  <HelpMode>Modeless</HelpMode>
  <Dir>Default</Dir>
  <PartImageSmall />
  <MissingAssembly>Cannot import this Web Part.</MissingAssembly>
  <PartImageLarge />
  <IsIncludedFilter />
  <ExportControlledProperties>true</ExportControlledProperties>
  <ConnectionID>00000000-0000-0000-0000-000000000000</ConnectionID>
  <ID>g_424a6de8_0853_46ca_abdd_9e24568de664</ID>
</WebPart>
</WpNs0:SiteFeedWebPart>
<WebPartPages:XsltListViewWebPart runat="server" ViewFlag="" ViewSelectorFetchAsync="False" InplaceSearchEnabled="False" ServerRender="False" ClientRender="True" InitialAsyncDataFetch="False" WebId="4c3384d9-bb3b-496f-b273-24fe2b3c9176" IsClientRender="False" GhostedXslLink="main.xsl" NoDefaultStyle="" ViewGuid="{EAA64854-ED16-49EA-A188-3294A0BFF819}" EnableOriginalValue="False" ViewContentTypeId="" ListUrl="" ListDisplayName="" ListName="{51E77762-290A-4B5D-B53C-B8E4DDEF0B45}" ListId="51e77762-290a-4b5d-b53c-b8e4ddef0b45" PageSize="-1" UseSQLDataSourcePaging="True" DataSourceID="" ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False" AutoRefresh="False" AutoRefreshInterval="60" Title="Documents" FrameType="Default" SuppressWebPartChrome="False" Description="" IsIncluded="True" ZoneID="wpz" PartOrder="10" FrameState="Normal" AllowRemove="True" AllowZoneChange="True" AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" CatalogIconImageUrl="/_layouts/15/images/itdl.png?rev=47" TitleUrl="/teams/products/ReactTemplate1Int/Shared Documents" DetailLink="/teams/products/ReactTemplate1Int/Shared Documents" HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="Cannot import this Web Part." PartImageLarge="/_layouts/15/images/itdl.png?rev=47" IsIncludedFilter="" ExportControlledProperties="False" ConnectionID="00000000-0000-0000-0000-000000000000" ID="g_94bf5186_7eb9_4940_9bd1_5046947b36a1" __MarkupType="vsattributemarkup" __WebPartId="{EAA64854-ED16-49EA-A188-3294A0BFF819}" __AllowXSLTEditing="true" __designer:CustomXsl="Fldtypes_mswhTitle.xsl;fldtypes_Ratings.xsl" WebPart="true" Height="" Width=""><ParameterBindings>
  <ParameterBinding Name="dvt_sortdir" Location="Postback;Connection"/>
            <ParameterBinding Name="dvt_sortfield" Location="Postback;Connection"/>
            <ParameterBinding Name="dvt_startposition" Location="Postback" DefaultValue=""/>
            <ParameterBinding Name="dvt_firstrow" Location="Postback;Connection"/>
            <ParameterBinding Name="OpenMenuKeyAccessible" Location="Resource(wss,OpenMenuKeyAccessible)" />
            <ParameterBinding Name="open_menu" Location="Resource(wss,open_menu)" />
            <ParameterBinding Name="select_deselect_all" Location="Resource(wss,select_deselect_all)" />
            <ParameterBinding Name="idPresEnabled" Location="Resource(wss,idPresEnabled)" /><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noitemsinview_doclibrary)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noitemsinview_doclibrary_howto2)" /></ParameterBindings>
<DataFields>
</DataFields>
<XmlDefinition>
<View Name="{EAA64854-ED16-49EA-A188-3294A0BFF819}" MobileView="TRUE" Type="HTML" Hidden="TRUE" DisplayName="" Url="/teams/products/ReactTemplate1Int/SitePages/Home.aspx" Level="1" BaseViewID="50" ContentTypeID="0x" ><Query><OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy></Query><ViewFields><FieldRef Name="DocIcon"/><FieldRef Name="LinkFilename"/></ViewFields><RowLimit Paged="TRUE">15</RowLimit><JSLink>clienttemplates.js</JSLink><XslLink Default="TRUE">main.xsl</XslLink><Toolbar Type="Standard"/></View></XmlDefinition>
</WebPartPages:XsltListViewWebPart>

												</ZoneTemplate></WebPartPages:WebPartZone>
                                            </td>
                                        </tr>
                                        <SharePoint:ScriptBlock runat="server">
                                            if(typeof(MSOLayout_MakeInvisibleIfEmpty) == "function")
                                            {MSOLayout_MakeInvisibleIfEmpty();}
                                        </SharePoint:ScriptBlock>
                                    </table>
                                </asp:Content>